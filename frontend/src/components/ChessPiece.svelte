<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type ChessPiece from "../utils/chess/ChessPiece";

  const dispatch = createEventDispatcher();

  export let piece: ChessPiece = null;
  export let index: number = 0;
  // TODO: Create a store
  export let board: ChessPiece[][] = [];
  export let validMove: boolean = false

  function handleClick() {
    if (piece) dispatch("click", piece.validMoves(board));
    else dispatch("click", []);
  }

</script>

<div id="container" class={index % 2 === 0 ? "even" : "odd"} on:click={handleClick}>
  {#if piece}
    <img src={piece.image} alt="piece icon" />
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
