<script lang="ts">
  import type { Channel, Socket } from "phoenix";
  import { onDestroy, onMount } from "svelte";
  import type { NavigateFn } from "svelte-navigator";
  import type RouteParams from "svelte-navigator/types/RouteParam";
  import Board from "../components/Board.svelte";
  import Clock from "../components/Clock.svelte";
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
  let playerTime: number = 0;
  let opponentTime: number = 0;
  let moveCounter: number = 0;
  onMount(async () => {
    await handleJoinLobby();
  });

  onDestroy(() => {
    roomChannel.leave().receive("ok", () => {
      roomChannel = null;
    });
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
        if (playerType === PlayerType.WHITE) {
          playerTime = resp.whiteTime;
          opponentTime = resp.blackTime;
        } else {
          playerTime = resp.blackTime;
          opponentTime = resp.whiteTime;
        }
        isLoading = false;
      })
      .receive("error", (resp) => {
        console.log(resp);
        roomChannel.leave();
        navigate("/404");
      });

    roomChannel.on("move", (resp: MoveResponse) => {
      if (moveCounter === 0) tickTime();
      if (hasSent) {
        hasSent = false;
      } else {
        chessBoard = ChessBoard.deserializeBoard(resp.board, playerType);
      }
      nextTurn = valueOf(resp.nextTurn);
      moveCounter++;
    });
  }

  function handleMove(e: CustomEvent<String[][]>) {
    roomChannel.push("move", { board: e.detail });
    hasSent = true;
  }

  function tickTime() {}
</script>

{#if isLoading}
  <!-- TODO: Loading animation -->
  <div id="loader" />
{:else}
  <div id="invisible" />
  <Board {playerType} {chessBoard} {nextTurn} on:move={handleMove} />
  <Clock {playerTime} {opponentTime} />
{/if}

<style>
  #invisible {
    height: 200px;
    width: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: red;
  }
  #loader {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
