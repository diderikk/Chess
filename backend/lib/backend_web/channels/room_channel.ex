defmodule BackendWeb.RoomChannel do
  use Phoenix.Channel

  alias OTP.Workers.Cache
  alias Helper.Room

  def join("room:" <> room_id, %{"userId" => user_id}, socket) do
    user_unique_id = {user_id, socket.assigns.address}
    IO.inspect Cache.read_memory(room_id)

    socket =
      socket
      |> assign(:user_id, user_unique_id)
      |> assign(:room_id, room_id)

    case Room.fetchFromCache(room_id, user_unique_id) |> Room.subtract_time() do
      nil ->
        {:error, %{reason: "Room not found"}}

      {color, board, turn, white_time, black_time} ->
        {:ok,
         %{
           color: color,
           board: board,
           nextTurn: turn,
           whiteTime: white_time,
           blackTime: black_time
         }, socket}
    end
  end

  def join(_channel, _payload, _socket), do: {:error, %{}}

  def handle_in("move", %{"board" => board}, socket) do
    {_stored_board, mode, first, second, color, last_time} = Cache.read_memory(socket.assigns.room_id)

    if Room.validateMove(socket.assigns.room_id, socket.assigns.user_id, color) do
      next_color = Room.handleMove(socket.assigns.room_id, last_time, first, second, board, color, mode)
      broadcast!(socket, "move", %{board: board, nextTurn: next_color})
      {:reply, :ok, socket}
    else
      {:reply, :error, socket}
    end
  end

end
