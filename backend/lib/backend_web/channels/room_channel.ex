defmodule BackendWeb.RoomChannel do
  use Phoenix.Channel

  def join("room:" <> room_id, _payload, socket) do
    {:ok, assign(socket, :room_id, room_id)}
    # {:ok, reply, assign(socket, :room_id, room_id)}
  end
end
