defmodule OTP.Workers.Queue do
  use GenServer

  alias OTP.Workers.Cache

  # External API

  @spec start_link(any) :: {:ok, pid}
  def start_link(init_arg) do
    GenServer.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  @spec push(binary(), pid(), binary(), tuple()) :: :ok
  def push(mode, channel_pid, color, id) do
    GenServer.cast(__MODULE__, {:push, mode, channel_pid, color, id})
  end

  @spec pop(binary(), tuple()) :: :ok
  def pop(mode, id) do
    GenServer.cast(__MODULE__, {:pop, mode, id})
  end

  # GenServer implementation

  @impl true
  @spec init(any) :: {:ok, {%{}}}
  def init(_init_arg) do
    {:ok, {%{}}}
  end

  @impl true
  def handle_cast({:pop, mode, id}, {queues}) do
    queue = Map.get(queues, mode) |> filter_queue(id)
    queues = Map.put(queues, mode, queue)
    {:noreply, {queues}}
  end

  @impl true
  def handle_cast({:push, mode, channel_pid, color, id}, {queues}) do
    queue = add_or_alert(channel_pid, color, Map.get(queues, mode), id)
    queues = Map.put(queues, mode, queue)
    {:noreply, {queues}}
  end

  defp add_or_alert(channel_pid, color, nil, id) do
    [{channel_pid, color, id}]
  end

  defp add_or_alert(channel_pid, color, [], id) do
    [{channel_pid, color, id}]
  end

  defp add_or_alert(channel_pid, color, queue, id) do
    [head | tail] = queue
    setup_and_alert(head, {channel_pid, color, id})
    tail
  end

  defp setup_and_alert({head_pid, head_color, head_id}, {second_pid, _second_color, second_id}) do
    {head_color, second_color} = select_color_delegation(head_color)

    room_id =
      Cache.create_memory(
        {initialize_board(), {head_id, head_color}, {second_id, second_color}, "WHITE"}
      )

    send(head_pid, {:found_opponent, head_color, room_id})
    send(second_pid, {:found_opponent, second_color, room_id})
    :ok
  end

  defp select_color_delegation("BLACK") do
    {"BLACK", "WHITE"}
  end

  defp select_color_delegation("WHITE") do
    {"WHITE", "BLACK"}
  end

  defp select_color_delegation("RANDOM") do
    random = :rand.uniform(2)

    if random == 1 do
      {"WHITE", "BLACK"}
    else
      {"BLACK", "WHITE"}
    end
  end

  defp filter_queue(queue, filter_id) do
    Enum.filter(queue, fn {_pid, _color, id} -> id != filter_id end)
  end

  defp initialize_board() do
    [
      ["wR", "wH", "wB", "wQ", "wK", "wB", "wH", "wR"],
      ["wP", "wP", "wP", "wP", "wP", "wP", "wP", "wP"],
      [nil, nil, nil, nil, nil, nil, nil, nil],
      [nil, nil, nil, nil, nil, nil, nil, nil],
      [nil, nil, nil, nil, nil, nil, nil, nil],
      [nil, nil, nil, nil, nil, nil, nil, nil],
      ["bP", "bP", "bP", "bP", "bP", "bP", "bP", "bP"],
      ["bR", "bH", "bB", "bQ", "bK", "bB", "bH", "bR"]
    ]
  end
end
