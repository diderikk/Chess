<script lang="ts">
  import { Socket } from "phoenix";
  import { onDestroy, onMount } from "svelte";
  import { Router, Route } from "svelte-navigator";
  import Home from "./views/Home.svelte";
import NotFound from "./views/NotFound.svelte";
  import Room from "./views/Room.svelte";

  let socket: Socket = null;

  onMount(() => {
    socket = new Socket("ws://localhost:4000/socket", {
      params: { user_id: "anonymous" },
    });
    socket.connect()
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
      <Route path=":room_id/:id" let:navigate let:params>
        <Room {socket} {navigate} {params} />
      </Route>
      <Route path="404" let:navigate>
        <NotFound {navigate}/>
      </Route>
    </div>
  </Router>
  {:else}
  <!-- TODO: Loading animation -->
  <div />
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
