defmodule Helper.Room do
  alias OTP.Workers.Cache

  def fetch_from_cache(room_id, user_id) do
    case Cache.read_memory(room_id) do
      {board, mode, {^user_id, color, time}, {_, _, opp_time}, turn, last, status} ->
        {color, board, mode, turn, time, opp_time, last, status}

      {board, mode, {_, _, opp_time}, {^user_id, color, time}, turn, last, status} ->
        {color, board, mode, turn, opp_time, time, last, status}

      {board, mode, {_, _, w_time}, {_, _, b_time}, turn, last, status} ->
        {"SPECTATOR", board, mode, turn, w_time, b_time, last, status}

      _ ->
        nil
    end
  end

  def validate_loss(room_id, user_id) do
    case Cache.read_memory(room_id) do
      {_, _, {^user_id, _, _}, {_, color, _}, _, _, _} ->
        {:ok, color}

      {_, _, {_, color, _}, {^user_id, _, _}, _, _, _} ->
        {:ok, color}

      {_, _, _, _, _, _, _} ->
        {:error, "SPECTATOR"}

      _ ->
        {:error, "NONE"}
    end
  end

  def validate_remis(room_id, user_id, {opp_user_id}) do
    case Cache.read_memory(room_id) do
      {_stored_board, _mode, {^opp_user_id, _, _}, {^user_id, _, _}, _color, _last_time, _status} ->
        :ok

      {_stored_board, _mode, {^user_id, _, _}, {^opp_user_id, _, _}, _color, _last_time, _status} ->
        :ok

      _ ->
        :error
    end
  end

  def validate_expired(room_id, user_id) do
    case fetch_from_cache(room_id, user_id) |> subtract_time() do
      {_color, _board, _mode, "WHITE", 0, _black_time, "PLAYING"} -> "BLACK"
      {_color, _board, _mode, "WHITE", 0, _black_time, "REMIS_REQUESTED"} -> "BLACK"
      {_color, _board, _mode, "BLACK", _white_time, 0, "PLAYING"} -> "WHITE"
      {_color, _board, _mode, "BLACK", _white_time, 0, "REMIS_REQUESTED"} -> "WHITE"
      _ -> nil
    end
  end

  def validate_move(room_id, user_id, expected_color) do
    case fetch_from_cache(room_id, user_id) do
      {^expected_color, _, _, _, _, _, _, "PLAYING"} -> true
      {^expected_color, _, _, _, _, _, _, "SETUP"} -> true
      {^expected_color, _, _, _, _, _, _, "REMIS_REQUESTED"} -> true
      _ -> false
    end
  end

  def handle_move(room_id, last_played, first_player, second_player, board, "WHITE", mode) do
    {user_id, _, time} = first_player
    [_minutes, increment] = split_mode(mode)
    new_socket_time = time |> subtract_time(last_played, increment)
    new_time = Timex.now() |> Timex.format!("{ISO:Basic}")

    Cache.update_memory(
      room_id,
      {board, mode, {user_id, "WHITE", new_socket_time}, second_player, "BLACK", new_time,
       "PLAYING"}
    )

    "BLACK"
  end

  def handle_move(room_id, last_played, first_player, second_player, board, "BLACK", mode) do
    {user_id, _, time} = second_player
    [_minutes, increment] = split_mode(mode)

    new_socket_time = time |> subtract_time(last_played, increment)

    new_time = Timex.now() |> Timex.format!("{ISO:Basic}")

    Cache.update_memory(
      room_id,
      {board, mode, first_player, {user_id, "BLACK", new_socket_time}, "WHITE", new_time,
       "PLAYING"}
    )

    "WHITE"
  end

  def subtract_time(socket_time, "", increment) do
    socket_time + increment
  end

  def subtract_time(socket_time, last_move_time, increment) do
    move_duration =
      last_move_time |> Timex.parse!("{ISO:Basic}") |> Timex.diff(Timex.now(), :seconds)

    socket_time + move_duration + increment
  end

  def subtract_time(nil) do
    nil
  end

  def subtract_time({color, board, mode, "WHITE", white_time, black_time, last_move_time, status}) do
    new_white_time = subtract_time(white_time, last_move_time, 0)

    if(new_white_time < 0) do
      {color, board, mode, "WHITE", 0, black_time, status}
    else
      {color, board, mode, "WHITE", new_white_time, black_time, status}
    end
  end

  def subtract_time({color, board, mode, "BLACK", white_time, black_time, last_move_time, status}) do
    new_black_time = subtract_time(black_time, last_move_time, 0)

    if(new_black_time < 0) do
      {color, board, mode, "BLACK", white_time, 0, status}
    else
      {color, board, mode, "BLACK", white_time, new_black_time, status}
    end
  end

  def subtract_time({color, board, mode, turn, white_time, black_time, _last_move_time, status}) do
    {color, board, mode, turn, white_time, black_time, status}
  end

  def add_increment(nil) do
    nil
  end

  def add_increment({color, board, mode, turn, white_time, black_time, status}) do
    [_minutes, increment] = split_mode(mode)
    {color, board, turn, white_time, black_time, increment, status}
  end

  def split_mode(mode) do
    case String.split(mode, ":") do
      [minutes, increment] -> [String.to_integer(minutes), String.to_integer(increment)]
      _ -> [3, 2]
    end
  end

  def update_room_status(room_id, new_status) do
    {board, mode, white, black, turn, last, _status} = Cache.read_memory(room_id)
    Cache.update_memory(room_id, {board, mode, white, black, turn, last, new_status})
  end
end
