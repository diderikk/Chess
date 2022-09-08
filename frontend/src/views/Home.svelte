<script lang="ts">
  import Pairing from "../components/Pairing.svelte";
  import SwitchContainer from "../components/SwitchContainer.svelte";
  import type { Channel, Socket } from "phoenix";
  import type LobbyEvent from "../types/LobbyEvent.type";
  import ChessColor from "../enums/ChessColor.enum";
  import type LobbyResponse from "../types/LobbyResponse.type";
  import type { NavigateFn } from "svelte-navigator";
  import type Lobby from "../types/Lobby.type";
  import type LobbyPresenceResponse from "../types/LobbyPresenceResponse.type";
  import LobbyTable from "../components/LobbyTable.svelte";
  import { modeIndex } from "../stores/mode";
  import { onDestroy, onMount } from "svelte";

  export let navigate: NavigateFn = null;
  export let socket: Socket = null;
  let lobbyChannel: Channel = null;

  let selected: number = 0;
  let lobbyList: Lobby[] = [];

  onMount(async () => {
    await handleJoinLobby(null);
  });

  onDestroy(() => {
    modeIndex.set(-1);
  });

  function handleSelect(e: CustomEvent<number>) {
    selected = e.detail;
  }

  console.log(lobbyList);

  async function handleJoinLobby(e: CustomEvent<LobbyEvent>) {
    if (lobbyChannel) await leaveLobby();
    const topic = `lobby:lobby`;

    if (e) {
      const color = ChessColor[e.detail.color];
      lobbyChannel = socket.channel(topic, { color, mode: e.detail.mode });
    } else {
      lobbyChannel = socket.channel(topic, {});
    }

    lobbyChannel.join().receive("ok", (resp) => {
      console.log("Joined", resp);
    });
    lobbyChannel.on("room", (resp: LobbyResponse) => {
      navigate(`${resp.roomId}/${resp.id}`);
    });
    lobbyChannel.on("presence_state", (resp: LobbyPresenceResponse) => {
      console.log("HELLO")
      lobbyList = []
      Object.keys(resp).forEach((mode) => {
        const lobbiesIt = resp[mode].ids.map((id) => {
          return { mode, id: id.id, color: id.color } as Lobby;
        });
        lobbyList = [...lobbyList, ...lobbiesIt]
      });
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
</script>

<div>
  <SwitchContainer {selected} on:select={handleSelect}>
    {#if selected === 0}
      <Pairing on:joinLobby={handleJoinLobby} on:leaveLobby={leaveLobby} />
    {:else}
      <LobbyTable on:joinLobby={handleJoinLobby} lobbyTable={lobbyList} />
    {/if}
  </SwitchContainer>
</div>

<style>
  div {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
