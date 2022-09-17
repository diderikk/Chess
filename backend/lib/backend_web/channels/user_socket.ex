defmodule BackendWeb.UserSocket do
  use Phoenix.Socket

  alias BackendWeb.RoomChannel
  alias BackendWeb.LobbyChannel

  channel "room:*", RoomChannel
  channel "lobby:*", LobbyChannel

  @impl true
  def connect(%{"userId" => "anonymous"}, socket, connect_info) do
    socket =
      socket
      |> assign(:address, connect_info.peer_data.address)
      |> assign(:anonymous, true)

    {:ok, assign(socket, :user_id, uuid())}
  end

  @impl true
  def connect(%{"userId" => user_id}, socket, connect_info) do
    socket =
      socket
      |> assign(:address, connect_info.peer_data.address)
      |> assign(:anonymous, false)

    {:ok, assign(socket, :user_id, user_id)}
  end

  def connect(_params, _socket, _connect_info), do: {:error, "Missing User ID"}

  @impl true
  def id(socket) do
    "user_socket:" <> socket.assigns.user_id
  end

  defp uuid() do
    uuid =
      Integer.to_string(:rand.uniform(4_294_967_296), 32) <>
        Integer.to_string(:rand.uniform(4_294_967_296), 32)

    uuid
  end
end
