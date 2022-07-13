<script lang="ts">
  import type { Channel, Socket } from "phoenix";
  import { onMount } from "svelte";
  import type { NavigateFn } from "svelte-navigator";
  import type RouteParams from "svelte-navigator/types/RouteParam";
  import Board from "../components/Board.svelte";
  import RoomStatus from "../enums/RoomStatus.enum";

  export let params: RouteParams = null;
  export let navigate: NavigateFn = null;
  export let socket: Socket = null;
  let roomChannel: Channel = null;
  let roomStatus: RoomStatus = RoomStatus.LOADING;
  console.log(roomStatus);
  onMount(async () => {
    if(roomStatus != RoomStatus.NOT_FOUND)
      await handleJoinLobby();
  });

  async function handleJoinLobby() {
    roomChannel = socket.channel(`room:${params.room_id}`);

    roomChannel
      .join()
      .receive("ok", (resp) => {
        console.log("Joined", resp);
        roomStatus = RoomStatus.FOUND;
      })
      .receive("error", (resp) => {
        console.log(resp);
        roomChannel.leave()
        navigate("/404")
      });
  }
</script>

{#if roomStatus == RoomStatus.LOADING}
  <!-- TODO: Loading animation -->
  <div />
{:else }
  <Board />
{/if}

<style>
  div {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
