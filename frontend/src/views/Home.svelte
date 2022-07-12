<script lang="ts">
  import Pairing from "../components/Pairing.svelte";
  import SwitchContainer from "../components/SwitchContainer.svelte";
  import type { Channel, Socket } from "phoenix";
  import type Lobby from "../types/Lobby.type";
  import ChessColor from "../enums/ChessColor.enum";
  import type LobbyResponse from "../types/LobbyResponse.type";
  import type { NavigateFn } from "svelte-navigator";

  export let navigate: NavigateFn = null;
  export let socket: Socket = null
  let lobbyChannel: Channel = null;
  

  let selected: number = 0;

  function handleSelect(e: CustomEvent<number>) {
    selected = e.detail;
  }

  async function handleJoinLobby(e: CustomEvent<Lobby>) {
    if(lobbyChannel)
      await leaveLobby()
    const color = ChessColor[e.detail.color];
    const topic = `lobby:${e.detail.mode.minutes}:${e.detail.mode.increment}`;
    lobbyChannel = socket.channel(topic, { color });

    lobbyChannel.join().receive("ok", (resp) => console.log("Joined", resp));
    lobbyChannel.on("room", (resp: LobbyResponse) => {
      navigate(`${resp.roomId}/${resp.id}`)
    });
  }

  async function leaveLobby(_e: CustomEvent<any> = null) {
    if(lobbyChannel)
        return new Promise<void>((res, _rej) => {
          lobbyChannel.leave().receive("ok", () => {
            console.log("Left")
            lobbyChannel = null
            res()
        })
      })
      
  }
</script>

<div>
  <SwitchContainer {selected} on:select={handleSelect}>
    <Pairing on:joinLobby={handleJoinLobby} on:leaveLobby={leaveLobby} />
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
