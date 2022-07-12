defmodule OTP.CacheTest do
  use ExUnit.Case, async: true

  alias OTP.Workers.Cache

  describe "cache should " do
    setup [:add_list_to_cache]

    test "add list" do
      id = Cache.create_memory({[1,2,3], "white_id", "black_id", "WHITE"})
      assert is_binary(id)
      assert {[1,2,3], "white_id", "black_id", "WHITE"} == Cache.read_memory(id)
    end

    test "return error when data is number" do
      assert :error == Cache.create_memory(1)
    end

    test "return error when data is binary" do
      assert :error == Cache.create_memory("test")
    end

    test "fetch data given by id", %{id: id} do
      assert is_tuple(Cache.read_memory(id))
    end

    test "fetch empty list when id does not exits" do
      assert {} == Cache.read_memory("123")
    end

    test "delete data given by id", %{id: id} do
      assert :ok == Cache.delete_memory(id)
      assert {} == Cache.read_memory(id)
    end
  end

  defp add_list_to_cache(_) do
    id = Cache.create_memory({[1,2,3], "white_id", "black_id", "WHITE"})

    %{id: id}
  end

end
