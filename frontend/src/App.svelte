<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import Board from "./components/Board.svelte";
import Home from "./views/Home.svelte";
</script>

<Router>
  <div>
    <Route path="/" component={Home} />
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