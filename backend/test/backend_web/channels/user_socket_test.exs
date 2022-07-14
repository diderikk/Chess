defmodule BackendWeb.UserSocketTest do
  use BackendWeb.ChannelCase, async: true

  alias BackendWeb.UserSocket

  describe "UserSocket: " do
    test "connecting to socket with user_id" do
      assert {:ok, _socket} = connect(UserSocket, %{user_id: "123"})
    end

    test "connecting to socket with anonymous" do
      assert {:ok, _socket} = connect(UserSocket, %{user_id: "anonymous"})
    end
  end

  describe "RoomChannel: " do
    setup [:connect_socket]

    test "joining a room", %{socket: socket} do
      {:ok, %{}, socket} = join(socket, "room:1234")

      assert socket.assigns.room_id == "1234"
    end
  end

  describe "LobbyChannel: " do
    setup [:connect_socket]

    test "joining a lobby", %{socket: socket} do
      {:ok, %{}, socket} = join(socket, "lobby:3:2", %{color: "RANDOM"})
      assert socket.assigns.mode == "3:2"
      assert socket.assigns.color == "RANDOM"
    end
  end

  defp connect_socket(_) do
    {:ok, socket} = connect(UserSocket, %{user_id: "1234"})
    %{socket: socket}
  end
end
