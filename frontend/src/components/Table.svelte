<script lang="ts">
  import type Lobby from "../types/Lobby.type";
  import TableItem from "./TableItem.svelte";

  export let lobbyTable: Lobby[] = [];
  export let firstIndexName: string = "Player ID";
  export let isLobbyTable: boolean = true;
</script>

<table>
  <tr>
    <th>{firstIndexName}</th>
    <th>Mode</th>
    <th>Color</th>
  </tr>

  {#each lobbyTable as lobby}
    <TableItem
      on:joinLobby
      on:joinRoom
      player={lobby.id}
      mode={lobby.mode}
      color={lobby.color}
      isLobbyItem={isLobbyTable}
    />
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
