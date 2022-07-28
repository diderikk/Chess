<script lang="ts">
  import type { Channel, Socket } from "phoenix";
  import { onDestroy, onMount } from "svelte";
  import type { NavigateFn } from "svelte-navigator";
  import type RouteParams from "svelte-navigator/types/RouteParam";
  import Board from "../components/Board.svelte";
  import Clock from "../components/Clock.svelte";
  import PlayerType, { valueOf } from "../enums/PlayerType.enum";
  import type FinishResponse from "../types/FinishResponse.type";
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
  let playerTime: number = 100;
  let opponentTime: number = 100;
  let movePlayed: boolean = false;
  let increment: number = 0;
  let finished: boolean = false;
  onMount(async () => {
    await handleJoinLobby();
  });

  onDestroy(async () => {
    await leaveRoom();
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
        movePlayed = resp.movePlayed;
        increment = resp.increment;
        if (playerType === PlayerType.BLACK) {
          playerTime = resp.blackTime;
          opponentTime = resp.whiteTime;
        } else {
          playerTime = resp.whiteTime;
          opponentTime = resp.blackTime;
        }
        if (resp.movePlayed === true) {
          // addLatency();
          tickTime(750);
        }
        isLoading = false;
      })
      .receive("error", async (resp) => {
        console.log(resp);
        await leaveRoom();
        navigate("/404");
      });

    roomChannel.on("move", (resp: MoveResponse) => {
      if (finished) return;
      if (hasSent) {
        hasSent = false;
      } else {
        chessBoard = ChessBoard.deserializeBoard(resp.board, playerType);
      }
      incrementTime();
      nextTurn = valueOf(resp.nextTurn);
      if (!movePlayed) tickTime(1000);
      movePlayed = true;
    });

    roomChannel.on("finished", (resp: FinishResponse) => {
      console.log("finished", resp);
      finished = true;
    });
  }

  async function leaveRoom() {
    return new Promise<void>((res, rej) => {
      if (!roomChannel) res();
      roomChannel
        .leave()
        .receive("ok", () => {
          roomChannel = null;
          res();
        })
        .receive("error", () => rej());
    });
  }

  function handleMove(e: CustomEvent<String[][]>) {
    if (!finished) {
      roomChannel.push("move", { board: e.detail });
      hasSent = true;
    }
  }

  function tickTime(timeout: number) {
    if (finished) return;
    if (nextTurn === playerType || playerType === PlayerType.SPECTATOR) {
      if (playerTime > 0) playerTime -= 1;
    } else {
      if (opponentTime > 0) opponentTime -= 1;
    }
    if(playerTime === 0 || opponentTime === 0) roomChannel.push("expired", {})
    setTimeout(() => tickTime(1000), timeout);
  }

  function incrementTime() {
    if (finished) return;
    if (nextTurn === playerType || playerType === PlayerType.SPECTATOR) {
      playerTime += increment;
    } else {
      opponentTime += increment;
    }
  }
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
    height: 25vh;
    width: 15%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    margin: 0 10px;
    padding: 10px 30px;
  }
  #loader {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
