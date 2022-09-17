<script lang="ts">
  import BlackKing from "../assets/pieces/king_black.png";
  import WhiteKing from "../assets/pieces/king_white.png";
  import CombinedKing from "../assets/pieces/king_combined.png";
  import { createEventDispatcher } from "svelte";
  import type LobbyEvent from "../types/LobbyEvent.type";
  import ChessColor from "../enums/ChessColor.enum";

  const dispatch = createEventDispatcher();

  export let player: string = "";
  export let mode: string = "";
  export let color: string = "";
  export let isLobbyItem: boolean = true;

  function colorToIcon(color: string) {
    switch (color) {
      case "RANDOM":
        return CombinedKing;
      case "WHITE":
        return WhiteKing;
      case "BLACK":
        return BlackKing;
    }
  }

  function handleRowClick() {
    if(isLobbyItem)
      dispatch("joinLobby", { mode, color: ChessColor[color] } as LobbyEvent);
    else
      dispatch("joinRoom", player)
  }
</script>

<tr on:click={handleRowClick}>
  <td>{player}</td>
  <td>{mode}</td>
  <td><img class="icon" src={colorToIcon(color)} alt="color icon" /></td>
</tr>

<style>
  tr {
    width: 100%;
    border-bottom: 1px solid grey;
    cursor: pointer;
  }
  tr:hover {
    background-color: rgba(61, 172, 61, 0.4);
  }
  td {
    padding: 10px 20px;
  }
  .icon {
    width: 3rem;
  }
</style>
