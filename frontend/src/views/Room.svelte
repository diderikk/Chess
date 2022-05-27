<script lang="ts">
  import Board from "../components/Board.svelte";

  import { Socket } from "phoenix";
  import { onMount } from "svelte";
  let socket: Socket = null;
  onMount(() => {
    socket = new Socket("ws://localhost:4000/socket");
    socket.connect({ user_id: "anonymous" });
  });
</script>

<div>
  <Board />
</div>

<style>
  div {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
