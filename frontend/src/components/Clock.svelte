<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import PlayerType from "../enums/PlayerType.enum";
  import RoomStatus from "../enums/RoomStatus.enum";
  import type RoomPresence from "../types/RoomPresence.type";
  import GameOptions from "./GameOptions.svelte";

  const dispatch = createEventDispatcher();

  export let playerType: PlayerType = PlayerType.SPECTATOR;
  export let playerTime: number = 0;
  export let opponentTime: number = 0;
  export let status: RoomStatus = RoomStatus.SETUP;
  export let roomPresence: RoomPresence[] = [];
  export let mobile: boolean = false;

  let awayTimer: number = 30;
  let isTicking: boolean = false;

  function addLeadingZero(number: number) {
    if (number < 10) return `0${number}`;
    return number.toString();
  }

  function formatTime(time: number) {
    return `${addLeadingZero(Math.trunc(time / 60))}:${addLeadingZero(
      time % 60
    )}`;
  }

  function getPlayerActivity(roomPresence: RoomPresence[]): boolean[] {
    const activities = Array(2).fill(false);
    roomPresence.forEach((presence) => {
      if (PlayerType[presence.color] === playerType) activities[0] = true;
      if (
        PlayerType[presence.color] !== playerType &&
        PlayerType[presence.color] !== PlayerType.SPECTATOR
      )
        activities[1] = true;
    });
    if (
      !activities[1] &&
      (status === RoomStatus.PLAYING ||
        status === RoomStatus.REMIS_REQUESTED ||
        status === RoomStatus.SETUP)
    ) {
      if (!isTicking) {
        isTicking = true;
        tickAwayTime();
      }
    } else {
      isTicking = false;
      awayTimer = 30;
    }
    return activities;
  }

  function tickAwayTime() {
    if (isTicking) {
      if (awayTimer === 0) {
        dispatch("timeout");
      } else {
        awayTimer -= 1;
        setTimeout(() => tickAwayTime(), 1000);
      }
    }
  }
</script>

<div id="container">
  {#if !mobile}
    <div class="row">
      <div class="activity-container">
        <div
          class="activity-ball"
          style="background-color: {getPlayerActivity(roomPresence)[1]
            ? 'green'
            : 'grey'}"
        />
        <h3>Anonymous</h3>
        <h3 hidden={awayTimer === 30} class="timer">{awayTimer}</h3>
      </div>
      <h3>{formatTime(opponentTime)}</h3>
    </div>
  {/if}

  <GameOptions
    {status}
    {playerType}
    {mobile}
    on:abort
    on:remis
    on:resign
    on:remisDeclined
    on:return
  />
  {#if !mobile}
    <div class="row">
      <div class="activity-container">
        <div
          class="activity-ball"
          style="background-color: {getPlayerActivity(roomPresence)[0]
            ? 'green'
            : 'grey'}"
        />
        <h3>Anonymous</h3>
      </div>
      <h3>{formatTime(playerTime)}</h3>
    </div>
  {/if}
</div>

<style>
  :global(:root) {
    --clock-width: 18%;
    --clock-height: 35vh;
  }
  #container {
    height: var(--clock-height);
    width: var(--clock-width);
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: flex-start;
    background-color: rgb(170, 196, 170);
    margin: 0 10px;
    padding: 10px 30px;
    border-radius: 10px;
  }
  .row {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .activity-container {
    display: flex;
    align-items: center;
    text-align: center;
    line-height: 0px;
  }
  .activity-ball {
    height: 1rem;
    width: 1rem;
    margin-right: 5px;
    border-radius: 50%;
  }
  .timer {
    margin-left: 10px;
  }

  @media only screen and (max-width: 1500px) {
    :global(:root) {
      --clock-width: 65vh;
      --clock-height: 7vh;
    }
  } 

  @media only screen and (max-width: 700px) {
    :global(:root) {
      --clock-width: 80vw;
      --clock-height: 5vh;
    }
  } 

  @media only screen and (max-width: 500px) {
    :global(:root) {
      --clock-width: 70vw;
      --clock-height: 5vh;
    }
  } 

</style>
