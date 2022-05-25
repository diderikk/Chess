<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type RowColumn from "../types/RowColumn.type";
  import type ChessPiece from "../utils/chess/ChessPiece";

  const dispatch = createEventDispatcher();

  export let piece: ChessPiece = null;
  export let row: number = 0;
  export let column: number = 0;
  export let validMove: boolean = false;
  export let isChecked: boolean = false;

  function handleClick() {
    if (validMove)
      dispatch("move", { row, column } as RowColumn);
    else dispatch("showValidMoves", piece);
  }
</script>

<div
  id="container"
  class={(row+column) % 2 === 0 ? "even" : "odd"}
  on:click={handleClick}
>
  {#if piece}
    <img class:checked={isChecked} src={piece.image} alt="piece icon" />
  {/if}
  {#if validMove}
    <div id="green-dot" />
  {/if}
</div>

<style>
  #container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  #green-dot {
    height: 20px;
    width: 20px;
    opacity: 0.4;
    border-radius: 50%;
    background-color: green;
    position: absolute;
  }
  .checked {
    border-radius: 50%;
    background-color: rgba(255, 0, 0, 0.5);
  } 
    img {
    width: 90%;
    height: 90%;
  }
  .even {
    background-color: antiquewhite;
  }
  .odd {
    background-color: darkgray;
  }
</style>
