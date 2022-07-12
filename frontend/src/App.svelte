<script lang="ts">
  import { Socket } from "phoenix";
  import { onDestroy, onMount } from "svelte";
  import { Router, Route } from "svelte-navigator";
  import Home from "./views/Home.svelte";
  import Room from "./views/Room.svelte";

  let socket: Socket = null;

  onMount(() => {
    socket = new Socket("ws://localhost:4000/socket", {
      params: { user_id: "anonymous" },
    });
    socket.connect();
  });

  onDestroy(() => {
    socket.disconnect();
  });
</script>

<Router>
  <div>
    <Route path="/">
      <Home socket={socket}/>
    </Route>
    <Route path=":room_id/:id">
      <Room socket={socket} />
    </Route>
  </div>
</Router>

<style>
  div {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
