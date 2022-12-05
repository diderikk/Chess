<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import PlayerType from "../enums/PlayerType.enum";
  import RoomStatus from "../enums/RoomStatus.enum";

  const dispatch = createEventDispatcher();

  export let open: boolean = false;
  export let status: RoomStatus = RoomStatus.SETUP;
  export let playerType: PlayerType = PlayerType.SPECTATOR;

  function closeModal() {
    dispatch("close");
  }

  function handleReturnToLobby() {
    dispatch("return");
  }

  function getTitleByStatus() {
    switch (status) {
      case RoomStatus.ABORTED:
        return "Game was aborted";
      case RoomStatus.BLACK:
        if (playerType === PlayerType.BLACK) return "You won the game!";
        return "You lost the game ;(";
      case RoomStatus.WHITE:
        if (playerType === PlayerType.WHITE) return "You won the game!";
        return "You lost the game ;(";
      case RoomStatus.REMIS:
        return "Game ended in remis :/";
      default:
        return "Game ended";
    }
  }
</script>

{#if open}
  <div id="modal-background" on:click={closeModal} />
  <div id="modal">
    <div class="close" on:click={closeModal} />
    <h2>{getTitleByStatus()}</h2>
    <button id="return-button" on:click={handleReturnToLobby}
      >Return to lobby!</button
    >
  </div>
{/if}

<style>
  h2 {
    margin: 40px;
  }
  /* h4 {
    margin-top: 20px;
  } */
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
    background-color: rgb(170, 196, 170);
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
  #return-button {
    height: 110%;
    width: 50%;
    border-radius: 10px;
    background-color: rgba(80, 92, 80, 0.2);
    cursor: pointer;
    border: 0;
    margin-bottom: 20px;
    padding: 15px 10px; 
  }
  #return-button:hover {
    background-color: rgba(80, 92, 80, 0.1);
  }
</style>
