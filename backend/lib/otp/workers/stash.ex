defmodule OTP.Workers.Stash do
  use GenServer

  # External Implementation

  @spec start_link(any) :: {:ok, pid}
  def start_link(arg) do
    GenServer.start_link(__MODULE__, arg, name: __MODULE__)
  end

  @spec read_stash(pid()) :: any
  def read_stash(stash_pid) do
    GenServer.call(stash_pid, :read)
  end

  @spec update_stash(pid, map) :: :ok
  def update_stash(stash_pid, new_map) do
    GenServer.cast(stash_pid, {:update, new_map})
  end

  # GenServer Implementation

  @impl true
  @spec init(any) :: {:ok, %{}}
  def init(_init_arg) do
    {:ok, %{}}
  end

  @impl true
  def handle_call(:read, _from, stash) do
    {:reply, stash, stash}
  end

  @impl true
  def handle_cast({:update, data}, _state) when is_map(data) do
    {:noreply, data}
  end

  @impl true
  def handle_cast({:update, _data}, state) do
    {:stop, "Input was not of type Map", state}
  end

  def child_spec(init_arg) do
    %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [init_arg]},
      restart: :permanent,
      type: :worker
    }
  end
end
