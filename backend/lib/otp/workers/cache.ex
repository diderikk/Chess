defmodule OTP.Workers.Cache do
  use GenServer

  alias OTP.Workers.Stash

  #####

  #External API

  @spec start_link(pid()) :: {:ok, pid}
  def start_link(stash_pid) do
    GenServer.start_link(__MODULE__, stash_pid, name: __MODULE__)
  end

  @spec read_memory(binary()) :: any
  def read_memory(id) do
    GenServer.call(__MODULE__, {:read, id})
  end

  @spec create_memory(list()) :: any
  def create_memory(data) do
    GenServer.call(__MODULE__, {:create, data})
  end

  @spec update_memory(binary(), list()) :: :ok
  def update_memory(id, data) do
    GenServer.cast(__MODULE__, {:update, id, data})
  end

  def delete_memory(id) do
    GenServer.cast(__MODULE__, {:delete, id})
  end
  # GenServer Implementation

  @impl true
  def init(stash_pid) do
    memory = Stash.read_stash(stash_pid)
    {:ok, {stash_pid, memory}}
  end

  @impl true
  def handle_call({:read, id}, _from, {_, memory} = state) do
    if Map.has_key?(memory, id) do
      {:reply, Map.get(memory, id), state}
    else
      {:stop, "No key stored with given ID", state}
    end
  end

  @impl true
  def handle_call({:create, data}, _from, {stash_pid, memory}) when is_list(data) do
    id = create_uuid(memory)
    memory = Map.put(memory, id, data)
    {:reply, id, {stash_pid, memory}}
  end

  @impl true
  def handle_call({:create, _data}, _from, state) do
    {:stop, "Data was not a list", state}
  end

  @impl true
  def handle_cast({:update, id, new_data}, {stash_pid, memory}) when is_list(new_data) do
    if Map.has_key?(memory, id) do
      memory = Map.put(memory, id, new_data)
      {:noreply, {stash_pid, memory}}
    else
      {:stop, "No key stored with given ID", {stash_pid, memory}}
    end
  end

  @impl true
  def handle_cast({:update, _id, _new_data}, {stash_pid, memory}) do
    {:stop, "Data was not a list", {stash_pid, memory}}
  end

  @impl true
  def handle_cast({:delete, id}, {stash_pid, memory}) do
    if Map.has_key?(memory, id) do
      memory = Map.delete(memory, id)
      {:noreply, {stash_pid, memory}}
    else
      {:stop, "No key stored with given ID", {stash_pid, memory}}
    end
  end

  @impl true
  def terminate(_reason, {stash_pid, memory}) do
    Stash.update_stash(stash_pid, memory)
    {:ok, {stash_pid, memory}}
  end

  def child_spec(stash_pid) do
    %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [stash_pid]},
      restart: :permanent,
      type: :worker
    }
  end

  defp create_uuid(map) do
    uuid =
      Integer.to_string(:rand.uniform(4_294_967_296), 32) <>
        Integer.to_string(:rand.uniform(4_294_967_296), 32)

    if Map.has_key?(map, uuid) do
      create_uuid(map)
    else
      uuid
    end
  end
end