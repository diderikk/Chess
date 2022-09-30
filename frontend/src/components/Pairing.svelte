<script lang="ts">
  import type MinuteIncrement from "../types/MinuteIncrement.type";
  import { Pulse } from "svelte-loading-spinners";
  import { createEventDispatcher, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import ChessColor from "../enums/ChessColor.enum";
  import type LobbyEvent from "../types/LobbyEvent.type";
  import { modeIndex } from "../stores/mode";

  const dispatch = createEventDispatcher();
  const defaultMinuteIncrements: MinuteIncrement[] = [
    { minutes: 1, increment: 0 },
    { minutes: 2, increment: 1 },
    { minutes: 3, increment: 0 },
    { minutes: 3, increment: 2 },
    { minutes: 5, increment: 0 },
    { minutes: 5, increment: 3 },
    { minutes: 10, increment: 0 },
    { minutes: 10, increment: 5 },
    { minutes: 15, increment: 10 },
    { minutes: 30, increment: 0 },
    { minutes: 30, increment: 20 },
  ];

  let modeSelected: number = -1;
  let openCustomModal: boolean = false;

  const modeUnsub = modeIndex.subscribe((val) => {
    modeSelected = val;
  });

  onDestroy(modeUnsub);

  function getTimeControlMode(timeControl: MinuteIncrement): string {
    if (timeControl.minutes < 3) return "Bullet";
    if (timeControl.minutes < 10) return "Blitz";
    if (timeControl.minutes < 30) return "Rapid";

    return "Classical";
  }

  function handleModeClick(mode: MinuteIncrement, index: number) {
    if (modeSelected !== index) {
      modeIndex.set(index);
      dispatch("joinLobby", {
        mode: `${mode.minutes}:${mode.increment}`,
        color: ChessColor.RANDOM,
      } as LobbyEvent);
    } else if (modeSelected === index) {
      modeIndex.set(-1);
      dispatch("leaveLobby");
    }
  }

  function handleCustomClick() {
    if (modeSelected !== 11) {
      dispatch("leaveLobby");
      dispatch("openCustomModal");
    } else {
      modeIndex.set(-1);
      dispatch("leaveLobby");
    }
  }

  function focus(element: any) {
    element.focus();
  }
</script>

<div class="container" use:focus>
  {#each defaultMinuteIncrements as minuteIncrement, index}
    <div
      class={index === modeSelected ? "time-control-clicked" : "time-control"}
      on:click={() => handleModeClick(minuteIncrement, index)}
    >
      {#if index === modeSelected}
        <div in:fade={{ delay: 100 }}>
          <Pulse size="50" color="orange" unit="px" />
        </div>
      {:else}
        <h2 readonly>
          {`${minuteIncrement.minutes} + ${minuteIncrement.increment}`}
        </h2>
        <h5 readonly>
          {getTimeControlMode(minuteIncrement)}
        </h5>
      {/if}
    </div>
  {/each}
  <div
    class={modeSelected === 11 ? "time-control-clicked" : "time-control"}
    on:click={handleCustomClick}
  >
    {#if modeSelected === 11}
      <div in:fade={{ delay: 100 }}>
        <Pulse size="50" color="orange" unit="px" />
      </div>
    {:else}
      <h4 readonly>Custom</h4>
    {/if}
  </div>
</div>

<style>
  :global(:root) {
    --font-size: 1.7rem;
    --grid-columns: repeat(3, 1fr);
    --grid-rows: repeat(4, 1fr):
  }
  .container {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-columns: var(--grid-columns);
    grid-template-rows: var(--grid-rows);
    column-gap: 8px;
    row-gap: 8px;
    font-size: var(--font-size);
  }
  .time-control {
    height: 100%;
    width: 100%;
    background-color: darkgray;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    /* border: 1px solid lightgray; */
    opacity: 0.8;
    cursor: pointer;
  }
  .time-control:hover {
    opacity: 0.7;
    background-color: green;
  }
  .time-control-clicked {
    height: 100%;
    width: 100%;
    background-color: green;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 7px;
    /* border: 1px solid lightgray; */
    opacity: 0.8;
    cursor: pointer;
  }
  h2 {
    margin: 10px;
    user-select: none;
  }
  h5 {
    margin: 0;
    user-select: none;
  }

  @media only screen and (max-width: 1000px) {
    :global(:root) {
      --font-size: 1.3rem;
    }
  }

  @media only screen and (max-width: 600px) {
    :global(:root) {
      --font-size: 1rem;
    }
  }

  @media only screen and (max-height: 800px) {
    :global(:root) {
      --font-size: 1.3rem;
    }
  }

  @media only screen and (max-height: 650px) {
    :global(:root) {
      --font-size: 1rem;
    }
  }

  @media only screen and (max-height: 550px) {
    :global(:root) {
      --font-size: 0.9rem;
    }
  }

  @media only screen and (max-width: 600px) and (max-height: 800px) {
    :global(:root) {
      --font-size: 1rem;
    }
  }
</style>
