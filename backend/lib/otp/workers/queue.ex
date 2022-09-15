defmodule OTP.Workers.Queue do
  use GenServer

  alias OTP.Workers.Cache
  alias Helper.Room

  # External API

  @spec start_link(any) :: {:ok, pid}
  def start_link(init_arg) do
    GenServer.start_link(__MODULE__, init_arg, name: __MODULE__)
  end

  @spec list :: map()
  def list() do
    GenServer.call(__MODULE__, :list)
  end

  @spec push(binary(), pid(), binary(), tuple(), binary() | nil) :: :ok
  def push(mode, channel_pid, color, id, priv) do
    GenServer.cast(__MODULE__, {:push, mode, channel_pid, color, id, priv})
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
  def handle_call(:list, _from, {queues}) do
    return_queues = Map.filter(queues, fn {key, _val} -> String.length(key) < 6 end)
    {:reply, return_queues, {queues}}
  end

  @impl true
  def handle_cast({:pop, mode, id}, {queues}) do
    queue = Map.get(queues, mode) |> filter_queue(id)

    queues =
      queues |> Map.put(mode, queue) |> Map.filter(fn {key, _val} -> String.length(key) < 6 end)

    {:noreply, {queues}}
  end

  @impl true
  def handle_cast({:push, mode, channel_pid, color, id, nil}, {queues}) do
    queue = add_or_alert(mode, channel_pid, color, Map.get(queues, mode), id)
    queues = Map.put(queues, mode, queue)
    {:noreply, {queues}}
  end

  @impl true
  def handle_cast({:push, mode, channel_pid, color, id, lobby_id}, {queues}) do
    queue = add_or_alert(mode, channel_pid, color, Map.get(queues, lobby_id), id)
    queues = Map.put(queues, lobby_id, queue)
    {:noreply, {queues}}
  end

  defp add_or_alert(mode, channel_pid, color, nil, id) do
    [{mode, channel_pid, color, id}]
  end

  defp add_or_alert(mode, channel_pid, color, [], id) do
    [{mode, channel_pid, color, id}]
  end

  defp add_or_alert(mode, channel_pid, color, [head | tail], id) do
    setup_and_alert(head, {mode, channel_pid, color, id})
    tail
  end

  defp setup_and_alert(
         {mode, head_pid, head_color, head_id},
         {_, second_pid, _second_color, second_id}
       ) do
    {head_color, second_color} = select_color_delegation(head_color)
    [minutes, _incr] = Room.split_mode(mode)

    room_id =
      if(head_color == "WHITE") do
        Cache.create_memory(
          {initialize_board(), mode, {head_id, head_color, 60 * minutes},
           {second_id, second_color, 60 * minutes}, "WHITE", "", "SETUP"}
        )
      else
        Cache.create_memory(
          {initialize_board(), mode, {second_id, second_color, 60 * minutes},
           {head_id, head_color, 60 * minutes}, "WHITE", "", "SETUP"}
        )
      end

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

  defp filter_queue(nil, _filter_id) do
    []
  end

  defp filter_queue(queue, filter_id) do
    Enum.filter(queue, fn {_mode, _pid, _color, id} -> id != filter_id end)
  end

  defp initialize_board() do
    [
      ["wR0", "wH0", "wB0", "wQ0", "wK0", "wB0", "wH0", "wR0"],
      ["wP0", "wP0", "wP0", "wP0", "wP0", "wP0", "wP0", "wP0"],
      [nil, nil, nil, nil, nil, nil, nil, nil],
      [nil, nil, nil, nil, nil, nil, nil, nil],
      [nil, nil, nil, nil, nil, nil, nil, nil],
      [nil, nil, nil, nil, nil, nil, nil, nil],
      ["bP0", "bP0", "bP0", "bP0", "bP0", "bP0", "bP0", "bP0"],
      ["bR0", "bH0", "bB0", "bQ0", "bK0", "bB0", "bH0", "bR0"]
    ]
  end
end
