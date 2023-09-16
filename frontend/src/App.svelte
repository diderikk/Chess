<script lang="ts">
  import { Socket } from "phoenix";
  import { onDestroy, onMount } from "svelte";
  import { Router, Route } from "svelte-navigator";
  import Home from "./views/Home.svelte";
  import LobbyLinked from "./views/LobbyLinked.svelte";
  import NotFound from "./views/NotFound.svelte";
  import Room from "./views/Room.svelte";

  let socket: Socket = null;

  onMount(() => {
    socket = new Socket("wss://chess.diderikk.dev/socket", {
      params: { userId: "anonymous" },
    });
    socket.connect();
  });

  onDestroy(() => {
    socket.disconnect();
  });
</script>

{#if socket && socket.isConnected}
  <Router>
    <div>
      <Route path="/" let:navigate>
        <Home {socket} {navigate} />
      </Route>
      <Route path="/lobby/:lobbyId" let:navigate let:params>
        <LobbyLinked {socket} {navigate} {params} />
      </Route>
      <Route path="/:roomId/:id" let:navigate let:params>
        <Room {socket} {navigate} {params} />
      </Route>
      <Route path="/:roomId/" let:navigate let:params>
        <Room {socket} {navigate} {params} />
      </Route>
      <Route path="404" let:navigate>
        <NotFound {navigate} />
      </Route>
      <Route path="*" let:navigate>
        <NotFound {navigate} />
      </Route>
    </div>
  </Router>
{:else}
  <!-- TODO: Loading animation -->
  <div>...</div>
{/if}

<style>
  div {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
