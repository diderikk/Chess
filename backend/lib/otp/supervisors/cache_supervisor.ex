defmodule OTP.Supervisors.CacheSupervisor do
  @moduledoc """
  Supervisor for cache
  """
  use Supervisor

  alias OTP.Workers.Cache

  @spec start_link(pid()) :: {:ok, pid}
  def start_link(stash_pid) do
    Supervisor.start_link(__MODULE__, stash_pid, name: __MODULE__)
  end

  def init(stash_pid) do
    children = [
      {Cache, stash_pid}
    ]

    Supervisor.init(children, strategy: :one_for_one)
  end

  def child_spec(stash_pid) do
    %{
      id: __MODULE__,
      start: {__MODULE__, :start_link, [stash_pid]},
      restart: :permanent,
      type: :supervisor
    }
  end
end
