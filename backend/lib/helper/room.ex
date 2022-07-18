defmodule Helper.Room do
  alias OTP.Workers.Cache

  def fetchFromCache(room_id, user_id) do
    case Cache.read_memory(room_id) do
      {board, _mode, {^user_id, color, time}, {_, _, opp_time}, turn, last} ->
        {color, board, turn, time, opp_time, last}

      {board, _mode, {_, _, opp_time}, {^user_id, color, time}, turn, last} ->
        {color, board, turn, opp_time, time, last}

      {board, _mode, {_, _, w_time}, {_, _, b_time}, turn, last} ->
        {"SPECTATOR", board, turn, w_time, b_time, last}

      _ ->
        nil
    end
  end

  def validateMove(room_id, user_id, expected_color) do
    case fetchFromCache(room_id, user_id) do
      {^expected_color, _, _, _, _, _} -> true
      _ -> false
    end
  end

  def handleMove(room_id, last_played, first_player, second_player, board, "WHITE", mode) do
    {user_id, _, time} = first_player
    [_minutes, increment] = split_mode(mode)
    new_socket_time = time |> subtract_time(last_played, increment)
    new_time = Timex.now() |> Timex.format!("{ISO:Basic}")

    Cache.update_memory(
      room_id,
      {board, mode, {user_id, "WHITE", new_socket_time}, second_player, "BLACK", new_time}
    )

    "BLACK"
  end

  def handleMove(room_id, last_played, first_player, second_player, board, "BLACK", mode) do
    {user_id, _, time} = second_player
    [_minutes, increment] = split_mode(mode)

    new_socket_time = time |> subtract_time(last_played, increment)

    new_time = Timex.now() |> Timex.format!("{ISO:Basic}")

    Cache.update_memory(
      room_id,
      {board, mode, first_player, {user_id, "BLACK", new_socket_time}, "WHITE", new_time}
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

  def subtract_time({color, board, "WHITE", white_time, black_time, last_move_time}) do
    new_white_time = subtract_time(white_time, last_move_time, 0)
    {color, board, "WHITE", new_white_time, black_time}
  end

  def subtract_time({color, board, "BLACK", white_time, black_time, last_move_time}) do
    new_black_time = subtract_time(black_time, last_move_time, 0)
    {color, board, "BLACK", white_time, new_black_time}
  end

  def split_mode(mode) do
    case String.split(mode, ":") do
      [minutes, increment] -> [String.to_integer(minutes), String.to_integer(increment)]
      _ -> [3, 2]
    end
  end
end
