<script lang="ts">
  import Pairing from "../components/Pairing.svelte";
  import SwitchContainer from "../components/SwitchContainer.svelte";
  import type { Channel, Socket } from "phoenix";
  import type LobbyEvent from "../types/LobbyEvent.type";
  import ChessColor from "../enums/ChessColor.enum";
  import type LobbyResponse from "../types/LobbyResponse.type";
  import type { NavigateFn } from "svelte-navigator";
  import type Lobby from "../types/Lobby.type";
  import type PresenceResponse from "../types/PresenceResponse.type";
  import Table from "../components/Table.svelte";
  import { modeIndex } from "../stores/mode";
  import { onDestroy, onMount } from "svelte";
  import LobbyModal from "../components/LobbyModal.svelte";
  import ClipboxTextInput from "../components/ClipboxTextInput.svelte";

  export let navigate: NavigateFn = null;
  export let socket: Socket = null;
  let lobbyChannel: Channel = null;
  let openCustomModal: boolean = false;
  let withFriend: boolean = false;
  let friendLink: string = "";

  let selected: number = 0;
  let lobbyList: Lobby[] = [];
  let roomList: Lobby[] = [];

  onMount(async () => {
    await handleJoinLobby(null);
  });

  onDestroy(async () => {
    modeIndex.set(-1);
    await leaveLobby();
  });

  function handleSelect(e: CustomEvent<number>) {
    selected = e.detail;
  }

  async function handleJoinLobby(e: CustomEvent<LobbyEvent>) {
    if (lobbyChannel) await leaveLobby();
    const topic = `lobby:lobby`;

    if (e) {
      const color = ChessColor[e.detail.color];
      if (withFriend) {
        lobbyChannel = socket.channel(topic, {
          color,
          mode: e.detail.mode,
          priv: null,
        });
        withFriend = false;
      } else
        lobbyChannel = socket.channel(topic, { color, mode: e.detail.mode });
    } else {
      lobbyChannel = socket.channel(topic, {});
    }

    lobbyChannel.join().receive("ok", (resp: { link: string | null }) => {
      if (resp.link) friendLink = resp.link;
      else friendLink = "";
      console.log("Joined", resp);
    });
    lobbyChannel.on("room", (resp: LobbyResponse) => {
      navigate(`${resp.roomId}/${resp.id}`);
    });
    lobbyChannel.on("presence_state", (resp: PresenceResponse) => {
      lobbyList = [];
      roomList = [];
      Object.keys(resp.lobbies).forEach((mode) => {
        const lobbiesIt = resp.lobbies[mode].ids.map((id) => {
          return { mode, id: id.id, color: id.color } as Lobby;
        });
        lobbyList = [...lobbyList, ...lobbiesIt];
      });
      roomList = resp.rooms.map(
        (room) =>
          ({ mode: room.mode, id: room.roomId, color: "RANDOM" } as Lobby)
      );
    });
  }

  async function leaveLobby(_e: CustomEvent<any> = null) {
    if (lobbyChannel)
      return new Promise<void>((res, _rej) => {
        lobbyChannel.leave().receive("ok", () => {
          console.log("Left");
          lobbyChannel = null;
          res();
        });
      });
  }

  function handleCustomModalClose() {
    openCustomModal = false;
    withFriend = false;
  }

  function handleModal(e: CustomEvent<LobbyEvent>) {
    modeIndex.set(11);
    openCustomModal = false;
    handleJoinLobby(e);
  }

  function handleCustomModalOpen(isWithFriend: boolean = false) {
    openCustomModal = true;
    withFriend = isWithFriend;
  }

  function joinRoom(e: CustomEvent<string>) {
    navigate(`/${e.detail}/`);
  }
</script>

<div id="container">
  <div class="sidebar-hidden" />

  <SwitchContainer {selected} on:select={handleSelect}>
    {#if selected === 0}
      <Pairing
        on:openCustomModal={() => handleCustomModalOpen()}
        on:joinLobby={handleJoinLobby}
        on:leaveLobby={() => handleJoinLobby(null)}
      />
    {:else if selected === 1}
      <Table on:joinLobby={handleJoinLobby} lobbyTable={lobbyList} />
    {:else}
      <Table
        lobbyTable={roomList}
        firstIndexName="Room ID"
        isLobbyTable={false}
        on:joinRoom={joinRoom}
      />
    {/if}
  </SwitchContainer>
  <div class="sidebar">
    <div class="sidebar-button" on:click={() => handleCustomModalOpen()}>
      <h3>Create A Game</h3>
    </div>
    {#if friendLink.length === 0}
      <div class="sidebar-button" on:click={() => handleCustomModalOpen(true)}>
        <h3>Play With A Friend</h3>
      </div>
    {:else}
      <ClipboxTextInput text={`http://localhost:8080/lobby/${friendLink}`} />
    {/if}
  </div>
  <LobbyModal
    title="Create a game"
    open={openCustomModal}
    on:closeModal={handleCustomModalClose}
    on:joinLobby={handleModal}
  />
</div>

<style>
  :global(:root) {
    --sidebar-width: 100%;
    --sidebar-height: 15%;
    --flex-direction: row;
    --home-justify-content: space-evenly;
    --sidebar-font-size: 1rem;
    --hidden: initial;
  }
  .sidebar-button {
    width: var(--sidebar-width);
    height: var(--sidebar-height);
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
    font-size: var(--sidebar-font-size);

  }
  .sidebar-button:hover {
    opacity: 0.7;
    background-color: green;
  }
  .sidebar {
    width: 300px;
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
  .sidebar-hidden{
    width: 300px;
    height: 400px;
    display: var(--hidden);
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
  h3 {
    margin: 10px;
    user-select: none;
  }
  #container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: var(--flex-direction);
    justify-content: space-evenly;
    align-items: center;
    overflow-y: auto;
    /* background-color: red; */
  }

  @media only screen and (max-width: 1450px) {
    :global(:root) {
      --sidebar-width: 90%;
      --sidebar-height: 15%;
    }
  }

  @media only screen and (max-width: 1200px) {
    :global(:root) {
      --sidebar-width: 80%;
      --sidebar-height: 15%;
    }
  }

  @media only screen and (max-width: 1000px) {
    :global(:root) {
      --sidebar-font-size: 0.9rem;
    }
  }

  @media only screen and (max-width: 1000px) {
    .sidebar-hidden{
    width: 0;
    height: 0;
    display: var(--hidden);
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
  }
    :global(:root) {
      --home-justify-content: space-evenly;
      --hidden: none;
      --flex-direction: column;
    }
  }

  @media only screen and (max-height: 700px) and (max-width: 800px) {
    :global(:root) {
      --home-justify-content: flex-start;
      --hidden: none;
      --flex-direction: column;
    }
  }


</style>
