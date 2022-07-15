<script lang="ts">
  import type { Channel, Socket } from "phoenix";
  import { onMount } from "svelte";
  import type { NavigateFn } from "svelte-navigator";
  import type RouteParams from "svelte-navigator/types/RouteParam";
  import Board from "../components/Board.svelte";
  import PlayerType, { valueOf } from "../enums/PlayerType.enum";
  import type MoveResponse from "../types/MoveResponse.type";
  import type RoomResponse from "../types/RoomResponse.type";
  import ChessBoard from "../utils/chess/ChessBoard";
  import type ChessPiece from "../utils/chess/ChessPiece";

  export let params: RouteParams = null;
  export let navigate: NavigateFn = null;
  export let socket: Socket = null;
  let roomChannel: Channel = null;
  let isLoading: boolean = true;
  let playerType: PlayerType = PlayerType.SPECTATOR;
  let chessBoard: ChessPiece[][] = null;
  let hasSent: boolean = false;
  let nextTurn: PlayerType = null;

  onMount(async () => {
    await handleJoinLobby();
  });

  async function handleJoinLobby() {
    // TODO: Store in localstorage
    roomChannel = socket.channel(`room:${params.roomId}`, {
      userId: params.id,
    });

    roomChannel
      .join()
      .receive("ok", (resp: RoomResponse) => {
        console.log("Joined", resp);
        playerType = valueOf(resp.color);
        chessBoard = ChessBoard.deserializeBoard(resp.board, playerType);
        nextTurn = valueOf(resp.nextTurn);
        isLoading = false;
      })
      .receive("error", (resp) => {
        console.log(resp);
        roomChannel.leave();
        navigate("/404");
      });
    roomChannel.on("move", (resp: MoveResponse) => {
      if (hasSent) {
        hasSent = false;
        nextTurn = valueOf(resp.nextTurn)
        return;
      }
      nextTurn = valueOf(resp.nextTurn);
      chessBoard = ChessBoard.deserializeBoard(resp.board, playerType);
    });
  }

  function handleMove(e: CustomEvent<String[][]>) {
    roomChannel.push("move", { board: e.detail });
    hasSent = true;
  }
</script>

{#if isLoading}
  <!-- TODO: Loading animation -->
  <div />
{:else}
  <Board {playerType} {chessBoard} {nextTurn} on:move={handleMove} />
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
