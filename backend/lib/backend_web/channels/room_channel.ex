defmodule BackendWeb.RoomChannel do
  use Phoenix.Channel

  alias OTP.Workers.Cache
  alias Helper.Room
  alias BackendWeb.Presence

  def join("room:" <> room_id, %{"userId" => user_id}, socket) do
    user_unique_id = {user_id, socket.assigns.address}

    socket =
      socket
      |> assign(:user_id, user_unique_id)
      |> assign(:room_id, room_id)

    send(self(), :after_join)

    case Room.fetch_from_cache(room_id, user_unique_id)
         |> Room.subtract_time()
         |> Room.add_increment() do
      nil ->
        {:error, %{reason: "Room not found"}}

      {color, board, turn, white_time, black_time, increment, status} ->
        {:ok,
         %{
           color: color,
           board: board,
           nextTurn: turn,
           whiteTime: white_time,
           blackTime: black_time,
           increment: increment,
           status: status
         }, socket}
    end
  end

  def join(_channel, _payload, _socket), do: {:error, %{}}

  def handle_info(:after_join, socket) do
    {user_id, _} = socket.assigns.user_id
    {:ok, _} = Presence.track(socket, user_id, %{})

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end

  def handle_in("move", %{"board" => board}, socket) do
    {_stored_board, mode, first, second, color, last_time, _status} =
      Cache.read_memory(socket.assigns.room_id)

    if Room.validate_move(socket.assigns.room_id, socket.assigns.user_id, color) do
      next_color =
        Room.handle_move(socket.assigns.room_id, last_time, first, second, board, color, mode)

      broadcast!(socket, "move", %{board: board, nextTurn: next_color})
      {:reply, :ok, socket}
    else
      {:reply, :error, socket}
    end
  end

  def handle_in("expired", _payload, socket) do
    winner = Room.validate_expired(socket.assigns.room_id, socket.assigns.user_id)

    if(winner == nil) do
      {:reply, :error, socket}
    else
      Room.update_room_status(socket.assigns.room_id, winner)
      broadcast!(socket, "finished", %{winner: winner})
      {:reply, :ok, socket}
    end
  end

  def handle_in("abort", _payload, socket) do
    {_color, _board, _mode, _turn, _time, _opp_time, _last, status} =
      Room.fetch_from_cache(socket.assigns.room_id, socket.assigns.user_id)

    if(status != "SETUP") do
      {:reply, :error, socket}
    else
      Room.update_room_status(socket.assigns.room_id, "ABORTED")
      broadcast!(socket, "aborted", %{})
      {:reply, :ok, socket}
    end
  end

  def handle_in("loss", _payload, socket) do
    {status, winner} = Room.validate_loss(socket.assigns.room_id, socket.assigns.user_id)

    if(status == :ok) do
      Room.update_room_status(socket.assigns.room_id, winner)
      broadcast!(socket, "finished", %{winner: winner})
      {:reply, :ok, socket}
    else
      {:reply, :error, socket}
    end
  end

  def handle_in("remis", %{"decline" => true}, socket) do
    {color, _board, _mode, _turn, _time, _opp_time, _last, _status} =
      Room.fetch_from_cache(socket.assigns.room_id, socket.assigns.user_id)

    if(color != "SPECTATOR") do
      Cache.delete_memory(socket.assigns.room_id <> "remis")
      Room.update_room_status(socket.assigns.room_id, "PLAYING")
      broadcast!(socket, "remis", %{decline: true})
      {:reply, :ok, socket}
    else
      {:reply, :error, socket}
    end
  end

  def handle_in("remis", %{"forced" => true}, socket) do
    cache_response = Cache.read_memory(socket.assigns.room_id <> "remis")

    if(cache_response == {}) do
      {color, _board, _mode, _turn, _time, _opp_time, _last, _status} =
        Room.fetch_from_cache(socket.assigns.room_id, socket.assigns.user_id)

      if(color != "SPECTATOR") do
        Cache.create_memory(socket.assigns.room_id <> "remis", {socket.assigns.user_id})
        Room.update_room_status(socket.assigns.room_id, "REMIS_REQUESTED")
        broadcast(socket, "remis_request", %{color: color})
        {:reply, :ok, socket}
      else
        {:reply, :error, socket}
      end
    else
      status = Room.validate_remis(socket.assigns.room_id, socket.assigns.user_id, cache_response)

      if(status == :ok) do
        Cache.delete_memory(socket.assigns.room_id <> "remis")
        Room.update_room_status(socket.assigns.room_id, "REMIS")
        broadcast!(socket, "remis", %{})
        {:reply, :ok, socket}
      else
        {:reply, :error, socket}
      end
    end
  end

  def handle_in("remis", _payload, socket) do
    cache_response = Cache.read_memory(socket.assigns.room_id <> "remis")

    if(cache_response == {}) do
      {color, _board, _mode, _turn, _time, _opp_time, _last, _status} =
        Room.fetch_from_cache(socket.assigns.room_id, socket.assigns.user_id)

      if(color != "SPECTATOR") do
        Cache.create_memory(socket.assigns.room_id <> "remis", {socket.assigns.user_id})
        Room.update_room_status(socket.assigns.room_id, "REMIS_REQUESTED")
        broadcast(socket, "remis_request", %{color: color})
        {:reply, :ok, socket}
      else
        {:reply, :error, socket}
      end
    else
      status = Room.validate_remis(socket.assigns.room_id, socket.assigns.user_id, cache_response)

      if(status == :ok) do
        Cache.delete_memory(socket.assigns.room_id <> "remis")
        Room.update_room_status(socket.assigns.room_id, "REMIS")
        broadcast!(socket, "remis", %{})
        {:reply, :ok, socket}
      else
        {:reply, :error, socket}
      end
    end
  end

  def handle_in("timeout", _, socket) do
    {color, _board, _mode, _turn, _time, _opp_time, _last, status} =
      Room.fetch_from_cache(socket.assigns.room_id, socket.assigns.user_id)

    opp_color = if color == "WHITE", do: "BLACK", else: "WHITE"

    opponent_has_timed_out =
      !(Map.values(Presence.list(socket))
        |> Enum.any?(fn
          {^opp_color, _metas} -> true
          _ -> false
        end))

    if(
      opponent_has_timed_out &&
        (status == "PLAYING" || status == "REMIS_REQUEST" || status == "SETUP")
    ) do
      {event, status} =
        case status do
          "PLAYING" -> {"finished", color}
          "REMIS_REQUEST" -> {"finished", color}
          "SETUP" -> {"aborted", "ABORTED"}
        end

      Room.update_room_status(socket.assigns.room_id, status)
      broadcast!(socket, event, %{winner: status})
      {:reply, :ok, socket}
    else
      {:reply, :error, socket}
    end
  end
end
