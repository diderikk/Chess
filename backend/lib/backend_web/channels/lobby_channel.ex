defmodule BackendWeb.LobbyChannel do
  use Phoenix.Channel

  alias OTP.Workers.Queue
  alias BackendWeb.Presence

  def join("lobby:lobby", %{"color" => color, "mode" => mode}, socket) do
    socket =
      socket
      |> assign(:mode, mode)
      |> assign(:color, color)

    send(self(), :after_join)

    Queue.push(mode, self(), color, {socket.assigns.user_id, socket.assigns.address})
    {:ok, socket}
  end

  def join("lobby:lobby", _payload, socket) do
    send(self(), :after_join)

    {:ok, socket}
  end

  def join(_channel, _payload, _socket), do: {:error, %{}}

  def terminate(_reason, socket) do
    if(Map.has_key?(socket.assigns, :mode)) do
      Queue.pop(socket.assigns.mode, {socket.assigns.user_id, socket.assigns.address})
      {:ok, socket}
    else
      Presence.untrack(socket, socket.assigns.user_id)
      {:ok, socket}
    end
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
end
