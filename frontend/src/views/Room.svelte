<script lang="ts">
import type { Channel, Socket } from "phoenix";

  import Board from "../components/Board.svelte";

  export let socket: Socket = null
  let lobbyChannel: Channel = null;
  
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
