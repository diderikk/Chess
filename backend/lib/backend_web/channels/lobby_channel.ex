defmodule BackendWeb.LobbyChannel do
  @moduledoc """
  Lobby Channel communction module
  """
  use Phoenix.Channel

  alias OTP.Workers.Queue
  alias BackendWeb.Presence

  def join("lobby:lobby", %{"color" => color, "mode" => mode, "priv" => priv}, socket) do
    if priv == nil do
      socket =
        socket
        |> assign(:mode, mode)
        |> assign(:color, color)

      send(self(), :after_join)
      lobby_id = uuid()
      socket = assign(socket, :priv, lobby_id)
      Queue.push(mode, self(), color, {socket.assigns.user_id, socket.assigns.address}, lobby_id)
      {:ok, %{link: lobby_id}, socket}
    else
      send(self(), :after_join)
      Queue.push(mode, self(), color, {socket.assigns.user_id, socket.assigns.address}, priv)
      {:ok, socket}
    end
  end

  def join("lobby:lobby", %{"color" => color, "mode" => mode}, socket) do
    socket =
      socket
      |> assign(:mode, mode)
      |> assign(:color, color)

    send(self(), :after_join)

    Queue.push(mode, self(), color, {socket.assigns.user_id, socket.assigns.address}, nil)
    {:ok, socket}
  end

  def join("lobby:lobby", _payload, socket) do
    send(self(), :after_join)

    {:ok, socket}
  end

  def join(_channel, _payload, _socket), do: {:error, %{}}

  def terminate(_reason, socket) do
    if Map.has_key?(socket.assigns, :mode) do
      if Map.has_key?(socket.assigns, :priv) do
        Queue.pop(socket.assigns.priv, {socket.assigns.user_id, socket.assigns.address})
      end

      Queue.pop(socket.assigns.mode, {socket.assigns.user_id, socket.assigns.address})
    end

    broadcast!(socket, "presence_state", Presence.list(socket))
    {:ok, socket}
  end

  @spec handle_info({:found_opponent, binary(), binary()}, Phoenix.Socket.t()) ::
          {:noreply, Phoenix.Socket.t()}
  def handle_info({:found_opponent, color, room_id}, socket) do
    push(socket, "room", %{roomId: room_id, color: color, id: socket.assigns.user_id})
    {:noreply, socket}
  end

  def handle_info(:after_join, socket) do
    {:ok, _} = Presence.track(socket, socket.assigns.user_id, %{})

    broadcast!(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  defp uuid() do
    uuid =
      Integer.to_string(:rand.uniform(4_294_967_296), 32) <>
        Integer.to_string(:rand.uniform(4_294_967_296), 32)

    uuid
  end
end
