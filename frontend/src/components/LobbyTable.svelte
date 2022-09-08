<script lang="ts">
import { createEventDispatcher } from "svelte";

  import type Lobby from "../types/Lobby.type";
  import LobbyItem from "./LobbyItem.svelte";
  

  export let lobbyTable: Lobby[] = [];
</script>

<table>
  <tr>
    <th>Player ID</th>
    <th>Mode</th>
    <th>Color</th>
  </tr>

  {#each lobbyTable as lobby}
    <LobbyItem on:joinLobby player={lobby.id} mode={lobby.mode} color={lobby.color} />
  {/each}
</table>

<style>
  table {
    padding: 0 30px;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0 15px;
    user-select: none;
  }
  tr {
    width: 100%;
  }
  th {
    text-align: left;
    padding: 10px 20px;
  }
</style>
