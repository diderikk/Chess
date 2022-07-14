defmodule BackendWeb.RoomChannel do
  use Phoenix.Channel

  alias OTP.Workers.Cache

  def join("room:" <> room_id, %{"userId" => user_id}, socket) do
    user_unique_id = {user_id, socket.assigns.address}
    socket = socket
    |> assign(:user_id, user_id)
    |> assign(:room_id, room_id)

    case fetchUserColor(room_id, user_unique_id) do
      nil -> {:error, %{reason: "Room not found"}}
      {color, board} -> {:ok, %{color: color, board: board}, socket}
    end
  end

  def join(_channel, _payload, _socket), do: {:error, %{}}

  def handle_in("move", %{"board" => board}, socket) do
    {_board, _first, _second, color} = Cache.read_memory(socket.assigns.room_id)
    if (validateMove(socket.assigns.room_id, socket.assigns.user_id, color)) do
      broadcast!(socket, "move", board)
      {:reply, :ok, socket}
    else
      {:reply, :error, socket}
    end
  end

  defp fetchUserColor(room_id, user_id) do
    IO.inspect(Cache.read_memory(room_id))
    IO.inspect(user_id)

    case Cache.read_memory(room_id) do
      {board, {^user_id, color}, _second, _turn} -> {color, board}
      {board, _first, {^user_id, color}, _turn} -> {color, board}
      {board, _first, _second, _turn} -> {"SPECTATOR", board}
      _ -> nil
    end
  end

  defp validateMove(room_id, user_id, expected_color) do
    case fetchUserColor(room_id, user_id) do
      {^expected_color, _board} -> true
      _ -> false
    end
  end
end
