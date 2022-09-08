<script lang="ts">
  import resignFlagIcon from "../assets/flag.png";
  import remisIcon from "../assets/half.png";
  import cancelIcon from "../assets/cancel.png";
  import confirmIcon from "../assets/check.png";
  import { createEventDispatcher, onDestroy } from "svelte";
  import RoomStatus from "../enums/RoomStatus.enum";
  import { message } from "../stores/message";

  const dispatch = createEventDispatcher();

  export let status: RoomStatus = RoomStatus.SETUP;
  let selected: number = -1;
  let messageValue: string = ""

  const messageUnSub = message.subscribe(val => {
    messageValue = val
  })


  onDestroy(messageUnSub)

  function handleImageClick(index: number) {
    if (
      index >= 1 &&
      status !== RoomStatus.REMIS_REQUESTED &&
      status !== RoomStatus.PLAYING
    )
      return;
    if (index === 0 && status !== RoomStatus.SETUP) return;
    selected = index;
    switch (index) {
      case 0:
        message.set("Are you sure you want to abort?");
        break;
      case 1:
        message.set("Offer remis?");
        break;
      case 2:
        message.set("Are you sure you want to resign?");
        break;
    }
  }

  function handleConfirm(confirmed: boolean) {
    if (confirmed) {
      if (status === RoomStatus.REMIS_REQUESTED) {
        dispatch("remis");
      } else {
        switch (selected) {
          case 0:
            dispatch("abort");
            break;
          case 1:
            dispatch("remis");
            break;
          case 2:
            dispatch("resign");
            break;
        }
      }
    } else {
      if (status === RoomStatus.REMIS_REQUESTED) {
        dispatch("remisDeclined");
      }
    }
    selected = -1;
    message.set("");
  }

  function gameFinished(status: RoomStatus): boolean {
    return (
      status === RoomStatus.WHITE ||
      status === RoomStatus.BLACK ||
      status === RoomStatus.ABORTED ||
      status === RoomStatus.REMIS
    );
  }

  function handleReturnToLobby() {
    dispatch("return")
  }
</script>

<div id="container">
  <h4 hidden={messageValue === ""}>{messageValue}</h4>
  <div id="img-container">
    {#if selected >= 0 || status === RoomStatus.REMIS_REQUESTED}
      <div class="confirm-container" on:click={() => handleConfirm(false)}>
        <img src={cancelIcon} alt="cancel icon" />
      </div>
    {/if}
    {#if status === RoomStatus.SETUP}
      <div
        class={selected !== 0
          ? "option-container"
          : "disabled-option-container"}
        on:click={() => handleImageClick(0)}
      >
        <img
          class={selected !== 0 ? "" : "disabled-img"}
          src={cancelIcon}
          alt="cancel icon"
        />
      </div>
    {/if}
    {#if selected !== 0 && selected !== 2 && status !== RoomStatus.REMIS_REQUESTED && !gameFinished(status)}
      <div
        class={status === RoomStatus.PLAYING && selected !== 1
          ? "option-container"
          : "disabled-option-container"}
        on:click={() => handleImageClick(1)}
      >
        <img
          class={status === RoomStatus.PLAYING && selected !== 1
            ? ""
            : "disabled-img"}
          src={remisIcon}
          alt="remis icon"
        />
      </div>
    {/if}
    {#if selected !== 0 && selected !== 1 && !gameFinished(status)}
      <div
        class={status === RoomStatus.PLAYING && selected !== 2
          ? "option-container"
          : "disabled-option-container"}
        on:click={() => handleImageClick(2)}
      >
        <img
          class={status === RoomStatus.PLAYING && selected !== 2
            ? ""
            : "disabled-img"}
          src={resignFlagIcon}
          alt="resign flag"
        />
      </div>
    {/if}

    {#if selected >= 0 || status === RoomStatus.REMIS_REQUESTED}
      <div class="confirm-container" on:click={() => handleConfirm(true)}>
        <img src={confirmIcon} alt="confirm icon" />
      </div>
    {/if}

    {#if gameFinished(status)}
      <button id="return-button" on:click={handleReturnToLobby}>Return to lobby!</button>
    {/if}
  </div>
</div>

<style>
  #container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  #img-container {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
  }
  #return-button{
    height: 110%;
    width: 70%;
    border-radius: 10px;
    background-color: rgba(80, 92, 80, 0.2);
    cursor: pointer;
    border: 0;
  }
  #return-button:hover {
    background-color: rgba(80, 92, 80, 0.1);
  }
  .option-container {
    cursor: pointer;
    padding: 5px;
    background-color: rgba(80, 92, 80, 0.2);
    border-radius: 10px;
  }
  .option-container:hover {
    background-color: rgba(80, 92, 80, 0.1);
  }
  .disabled-option-container {
    padding: 5px;
    background-color: rgba(80, 92, 80, 0.1);
    border-radius: 10px;
  }
  .confirm-container {
    cursor: pointer;
    padding: 5px;
    background-color: rgba(61, 172, 61, 0.2);
    border-radius: 10px;
  }
  .confirm-container:hover {
    background-color: rgba(61, 172, 61, 0.1);
  }
  img {
    width: 3rem;
    height: 3rem;
  }
  .disabled-img {
    opacity: 0.3;
  }
  h4 {
    margin: 20px 0;
  }
</style>
