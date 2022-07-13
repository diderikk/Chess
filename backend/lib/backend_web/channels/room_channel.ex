defmodule BackendWeb.RoomChannel do
  use Phoenix.Channel

  alias OTP.Workers.Cache

  def join("room:" <> room_id, _payload, socket) do
    case fetchUserColor(room_id, socket.assigns.user_id) do
      nil -> {:error, %{reason: "Room not found"}}
      color -> {:ok, color, assign(socket, :room_id, room_id)}
    end
  end

  def join(_channel, _payload, _socket), do: {:error, %{}}


  defp fetchUserColor(room_id, user_id) do
    case Cache.read_memory(room_id) do
      {_board, {^user_id, color}, _second, _turn} -> color
      {_board, _first, {^user_id, color}, _turn} -> color
      {_board, _first, _second, _turn} -> "SPECTATOR"
      _ -> nil
    end
  end
end
