defmodule BackendWeb.RoomChannel do
  use Phoenix.Channel

  alias OTP.Workers.Cache

  def join("room:" <> room_id, %{"userId" => user_id}, socket) do
    user_unique_id = {user_id, socket.assigns.address}
    socket = socket
    |> assign(:user_id, user_unique_id)
    |> assign(:room_id, room_id)

    case fetchUserColor(room_id, user_unique_id) do
      nil -> {:error, %{reason: "Room not found"}}
      {color, board, turn, time} -> {:ok, %{color: color, board: board, nextTurn: turn, time: time}, socket}
    end
  end

  def join(_channel, _payload, _socket), do: {:error, %{}}

  def handle_in("move", %{"board" => board}, socket) do
    {_stored_board, first, second, color, time} = Cache.read_memory(socket.assigns.room_id)
    if (validateMove(socket.assigns.room_id, socket.assigns.user_id, color)) do
      next_color = handleMove(socket.assigns.room_id, first, second, board, time, color)
      broadcast!(socket, "move", %{board: board, nextTurn: next_color})
      {:reply, :ok, socket}
    else
      {:reply, :error, socket}
    end
  end

  defp fetchUserColor(room_id, user_id) do
    case Cache.read_memory(room_id) do
      {board, {^user_id, color}, _second, turn, time} -> {color, board, turn, time}
      {board, _first, {^user_id, color}, turn, time} -> {color, board, turn, time}
      {board, _first, _second, turn, time} -> {"SPECTATOR", board, turn, time}
      _ -> nil
    end
  end

  defp validateMove(room_id, user_id, expected_color) do
    case fetchUserColor(room_id, user_id) do
      {^expected_color, _board, _turn, _time} -> true
      _ -> false
    end
  end

  defp handleMove(room_id, first_player, second_player, board, time, "WHITE") do
    new_time = Timex.parse!(time, "{ISO:Basic}") |> Timex.shift(seconds: 2) |> Timex.format("{ISO:Basic}")
    Cache.update_memory(room_id, {board, first_player, second_player, "BLACK", new_time})
    "BLACK"
  end

  defp handleMove(room_id, first_player, second_player, board, time, "BLACK") do
    new_time = Timex.parse!(time, "{ISO:Basic}") |> Timex.shift(seconds: 2) |> Timex.format("{ISO:Basic}")
    Cache.update_memory(room_id, {board, first_player, second_player, "WHITE", new_time})
    "WHITE"
  end
end
