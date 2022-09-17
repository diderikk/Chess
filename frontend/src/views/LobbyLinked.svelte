<script lang="ts">
  import type { Channel, Socket } from "phoenix";
  import { onDestroy, onMount } from "svelte";
  import type { NavigateFn } from "svelte-navigator";
  import type RouteParams from "svelte-navigator/types/RouteParam";
  import type LobbyResponse from "../types/LobbyResponse.type";

  export let navigate: NavigateFn = null;
  export let socket: Socket = null;
  export let params: RouteParams = null;
  let lobbyChannel: Channel = null;
  let loading: boolean = true;

  onMount(async () => {
    await handleJoinLobby();
    setTimeout(() => {
      loading = false;
    }, 1500);
  });

  onDestroy(async () => {
    await leaveLobby();
  });

  async function handleJoinLobby() {
    if (lobbyChannel) await leaveLobby();
    const topic = `lobby:lobby`;

    lobbyChannel = socket.channel(topic, {
      color: null,
      mode: null,
      priv: params.lobbyId,
    });

    lobbyChannel.join()
    lobbyChannel.on("room", (resp: LobbyResponse) => {
      navigate(`/${resp.roomId}/${resp.id}`);
    });
  }

  async function leaveLobby(_e: CustomEvent<any> = null) {
    if (lobbyChannel)
      return new Promise<void>((res, _rej) => {
        lobbyChannel.leave().receive("ok", () => {
          lobbyChannel = null;
          res();
        });
      });
  }

  function handleClick() {
    navigate("/");
  }
</script>

<div>
  {#if !loading}
    <div>
      <h1 on:click={() => handleClick()}>404</h1>
      <h3>Room Not Found</h3>
    </div>
  {/if}
</div>

<style>
  div {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  h1 {
    cursor: pointer;
  }
  h1:hover {
    color: blue;
  }

  h3:focus {
    outline: none;
  }

  h1:focus {
    outline: none;
  }
</style>
