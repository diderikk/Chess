<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import BlackKing from "../assets/pieces/king_black.png";
  import WhiteKing from "../assets/pieces/king_white.png";
  import CombinedKing from "../assets/pieces/king_combined.png";
  import ChessColor from "../enums/ChessColor.enum";
  import type LobbyEvent from "../types/LobbyEvent.type";

  const dispatch = createEventDispatcher();

  export let open: boolean = false;
  export let title: string = "";

  let minutes: number[] = [5];
  let increment: number[] = [5];

  function closeModal() {
    dispatch("closeModal");
  }

  function handleCreateGame(color: ChessColor) {
    dispatch("joinLobby", {
      mode: `${minutes[0]}:${increment[0]}`,
      color,
    } as LobbyEvent);
  }
</script>

{#if open}
  <div id="modal-background" on:click={closeModal} />
  <div id="modal">
    <div class="close" on:click={closeModal} />
    <h2>{title}</h2>
    <div id="slider-container">
      <div class="slider-container">
        <h4>Minutes per side: {minutes[0]}</h4>
        <RangeSlider id="slider" bind:values={minutes} max={30} />
      </div>
      <div class="slider-container">
        <h4>Increments in seconds: {minutes[0]}</h4>
        <RangeSlider id="slider" bind:values={increment} max={30} />
      </div>
    </div>
    <div id="color-selection">
      <div class="color" on:click={() => handleCreateGame(ChessColor.BLACK)}>
        <img class="icon" src={BlackKing} alt="black king" />
      </div>
      <div class="color" on:click={() => handleCreateGame(ChessColor.RANDOM)}>
        <img id="combined-icon" src={CombinedKing} alt="combined king" />
      </div>
      <div class="color" on:click={() => handleCreateGame(ChessColor.WHITE)}>
        <img class="icon" src={WhiteKing} alt="white king" />
      </div>
    </div>
  </div>
{/if}

<style>
    :global(:root) {
      --modal-width: 30vw;
    }
  div {
    --range-handle-inactive: green; /* inactive handle color */
    --range-handle: green; /* non-focussed handle color */
    --range-handle-focus: green; /* focussed handle color */
  }
  h2 {
    margin: 40px;
  }
  h4 {
    margin-top: 20px;
  }
  #modal-background {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    left: 0;
    background-color: black;
    opacity: 0.4;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #modal {
    position: absolute;
    background-color: white;
    width: var(--modal-width);
    /* height: 80vh; */
    border-radius: 7px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  #color-selection {
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    margin: 40px 0;
  }
  #slider-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid lightgrey;
    border-top: 1px solid lightgrey;
  }
  #combined-icon {
    width: 7rem;
  }
  .color {
    background-color: lightgray;
    border-radius: 7px;
    margin: 0 5px;
    cursor: pointer;
  }
  .color:hover {
    background-color: rgb(230, 228, 228);
  }
  .icon {
    width: 5rem;
  }
  .slider-container {
    width: 80%;
    text-align: center;
  }
  .close {
    position: absolute;
    right: 32px;
    top: 32px;
    width: 32px;
    height: 32px;
    opacity: 0.5;
    cursor: pointer;
  }
  .close:hover {
    opacity: 1;
  }
  .close:before,
  .close:after {
    position: absolute;
    left: 15px;
    content: " ";
    height: 33px;
    width: 2px;
    background-color: #333;
  }
  .close:before {
    transform: rotate(45deg);
  }
  .close:after {
    transform: rotate(-45deg);
  }

  @media only screen and (max-width: 1250px) {
    :global(:root) {
      --modal-width: 50vw
    }
  }

  @media only screen and (max-width: 700px) {
    :global(:root) {
      --modal-width: 70vw
    }
  }

  @media only screen and (max-width: 500px) {
    :global(:root) {
      --modal-width: 90vw
    }
  }

  @media only screen and (max-width: 350px) {
    :global(:root) {
      --modal-width: 95vw
    }
  }
</style>
