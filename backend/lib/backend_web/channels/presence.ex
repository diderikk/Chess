defmodule BackendWeb.Presence do
  @moduledoc """
  Provides presence tracking to channels and processes.

  See the [`Phoenix.Presence`](https://hexdocs.pm/phoenix/Phoenix.Presence.html)
  docs for more details.
  """
  use Phoenix.Presence,
    otp_app: :backend,
    pubsub_server: Backend.PubSub

  alias OTP.Workers.Cache
  alias OTP.Workers.Queue

  def fetch(topic, presences) do
    if(String.starts_with?(topic, "room")) do
      "room:" <> room_id = topic
      colors = presences |> Map.keys() |> ids_to_colors(room_id)

      for {key, %{metas: metas}} <- presences, into: %{} do
        {key, %{metas: metas, color: colors[key]}}
      end
    else
      queue = Queue.list()

      for {mode, queue} <- queue, into: %{} do
        ids =
          Enum.map(queue, fn {_pid, color, {user_id, _address}} ->
            %{id: user_id, color: color}
          end)

        {mode, %{ids: ids, metas: []}}
      end
    end
  end

  defp ids_to_colors(ids, room_id) do
    {_, _, {{white_id, _}, _, _}, {{black_id, _}, _, _}, _, _, _} = Cache.read_memory(room_id)

    for id <- ids, into: %{} do
      case id do
        ^white_id -> {id, "WHITE"}
        ^black_id -> {id, "BLACK"}
        id -> {id, "SPECTATOR"}
      end
    end
  end
end
