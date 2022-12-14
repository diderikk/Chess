<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type RowColumn from "../types/RowColumn.type";
  import type ChessPiece from "../utils/chess/ChessPiece";
  import BlankIcon from "../assets/pieces/king_combined.png";

  const dispatch = createEventDispatcher();

  export let piece: ChessPiece = null;
  export let row: number = 0;
  export let column: number = 0;
  export let validMove: boolean = false;
  export let isChecked: boolean = false;

  let pieceDragedEntered: boolean = false;

  function handleClick() {
    pieceDragedEntered = false;
    if (validMove) dispatch("move", { row, column } as RowColumn);
    else dispatch("showValidMoves", piece);
  }

  function classSelector() {
    if (pieceDragedEntered) return "drag-enter";
    return (row + column) % 2 === 0 ? "even" : "odd";
  }

  function handleDragStart(e: DragEvent, piece: ChessPiece) {
    e.dataTransfer.dropEffect = "move";
    e.dataTransfer.setData("text", JSON.stringify({ row, column }));

    dispatch("showDragValidMoves", piece);
  }

  function handleDragEnd(_e: DragEvent) {
    dispatch("showValidMoves", piece);
  }

  function handleDragEnter(_e: DragEvent) {
    if (validMove) pieceDragedEntered = true;
  }

  function handleDragLeave(_e: DragEvent) {
    if (validMove) pieceDragedEntered = false;
  }

  function handleDragDrop(e: DragEvent) {
    e.preventDefault();
    if (validMove) {
      dispatch("move", { row, column } as RowColumn);
      pieceDragedEntered = false;
    }
  }
</script>

<div
  id="container"
  class={pieceDragedEntered ? "drag-enter" : classSelector()}
  on:click={handleClick}
  on:dragenter={handleDragEnter}
  on:dragleave={handleDragLeave}
  on:drop={handleDragDrop}
  on:dragover={(ev) => {
    ev.preventDefault();
  }}
  on:focus={() => {}}
  on:mouseover={() => handleDragEnter(null)}
  on:mouseleave={() => handleDragLeave(null)}
>
  {#if piece}
    <img
      on:dragstart={(e) => handleDragStart(e, piece)}
      on:dragend={handleDragEnd}
      on:dragenter={handleDragEnter}
      on:dragleave={handleDragLeave}
      on:drop={handleDragDrop}
      on:dragover={(ev) => {
        ev.preventDefault();
      }}
      class:checked={isChecked}
      src={piece.image}
      alt="piece icon"
    />
  {:else}
    <img class="invisible" src={BlankIcon} alt="blank" />
  {/if}
  {#if validMove && !pieceDragedEntered}
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
  .invisible {
    visibility: hidden;
  }
  img {
    width: 100%;
    height: 100%;
    padding: 5px;
  }
  .even {
    background-color: antiquewhite;
  }
  .odd {
    background-color: darkgray;
  }
  .drag-enter {
    background-color: rgba(0, 128, 0, 0.4);
  }
</style>
