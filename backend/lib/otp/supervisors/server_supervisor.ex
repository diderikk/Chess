defmodule OTP.Supervisors.ServerSupervisor do
  use Supervisor

  alias OTP.Supervisors.CacheSupervisor
  alias OTP.Workers.Stash
  alias OTP.Workers.Queue

  @spec start_link() :: {:ok, pid}
  def start_link() do
    status = Supervisor.start_link(__MODULE__, :ok, name: __MODULE__)

    {:ok, stash_pid} = Supervisor.start_child(__MODULE__, {Stash, []})
    {:ok, _pid} = Supervisor.start_child(__MODULE__, {CacheSupervisor, stash_pid})

    status
  end

  @impl true
  def init(_init_arg) do
    Supervisor.init([{Queue, []}], strategy: :one_for_one)
  end

  def child_spec(_init_arg) do
    %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, []},
      restart: :permanent,
      type: :supervisor
    }
  end
end
