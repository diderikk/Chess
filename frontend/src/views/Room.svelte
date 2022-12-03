<script lang="ts">
  import { Presence, type Channel, type Socket } from "phoenix";
  import { onDestroy, onMount } from "svelte";
  import type { NavigateFn } from "svelte-navigator";
  import type RouteParams from "svelte-navigator/types/RouteParam";
  import Board from "../components/Board.svelte";
  import Clock from "../components/Clock.svelte";
  import GameFinishedModal from "../components/GameFinishedModal.svelte";
  import ChessColor from "../enums/ChessColor.enum";
  import Finished from "../enums/Finished.enum";
  import PlayerType from "../enums/PlayerType.enum";
  import RoomStatus from "../enums/RoomStatus.enum";
  import type FinishResponse from "../types/FinishResponse.type";
  import type MoveResponse from "../types/MoveResponse.type";
  import type RemisRequestResponse from "../types/RemisRequestResponse.type";
  import type RemisResponse from "../types/RemisResponse.type";
  import type RoomPresence from "../types/RoomPresence.type";
  import type RoomResponse from "../types/RoomResponse.type";
  import ChessBoard from "../utils/chess/ChessBoard";
  import type ChessPiece from "../utils/chess/ChessPiece";
  import { message } from "../stores/message";

  export let params: RouteParams = null;
  export let navigate: NavigateFn = null;
  export let socket: Socket = null;
  let innerWidth = 0;
  let roomChannel: Channel = null;
  let presence: Presence = null;
  let roomPresence: RoomPresence[] = [];
  let isLoading: boolean = true;
  let playerType: PlayerType = PlayerType.SPECTATOR;
  let chessBoard: ChessPiece[][] = null;
  let hasSent: boolean = false;
  let nextTurn: PlayerType = null;
  let playerTime: number = 100;
  let opponentTime: number = 100;
  let increment: number = 0;
  let status: RoomStatus = RoomStatus.SETUP;
  let isTicking: boolean = false;
  let openGameFinishedModal: boolean = gameFinished();

  $: mobile = innerWidth < 1200;

  console.log(mobile);

  onMount(async () => {
    await handleJoinLobby();
  });

  onDestroy(async () => {
    await leaveRoom();
  });

  async function handleJoinLobby() {
    roomChannel = socket.channel(`room:${params.roomId}`, {
      userId: params.id !== undefined ? params.id : null,
    });

    roomChannel
      .join()
      .receive("ok", (resp: RoomResponse) => {
        presence = new Presence(roomChannel);
        if (presence)
          presence.onSync(() => {
            roomPresence = [];
            presence.list((_id, idk) => {
              roomPresence = [...roomPresence, idk];
            });
          });

        playerType = PlayerType[resp.color];
        chessBoard = ChessBoard.deserializeBoard(resp.board, playerType);
        nextTurn = PlayerType[resp.nextTurn];
        increment = resp.increment;
        status = RoomStatus[resp.status];
        if (playerType === PlayerType.BLACK) {
          playerTime = resp.blackTime;
          opponentTime = resp.whiteTime;
        } else {
          playerTime = resp.whiteTime;
          opponentTime = resp.blackTime;
        }
        if (!gameFinished() && status !== RoomStatus.SETUP && !isTicking) {
          // addLatency();
          tickTime(750);
        }
        if (gameFinished()) openGameFinishedModal = true;
        isLoading = false;
      })
      .receive("error", async (resp) => {
        console.log(resp);
        await leaveRoom();
        navigate("/404");
      });

    roomChannel.on("move", (resp: MoveResponse) => {
      if (gameFinished()) return;
      if (hasSent) {
        hasSent = false;
      } else {
        chessBoard = ChessBoard.deserializeBoard(resp.board, playerType);
      }
      nextTurn = PlayerType[resp.nextTurn];
      if (nextTurn === playerType) {
        const isFinished = ChessBoard.isFinished(
          ChessColor[resp.nextTurn],
          chessBoard
        );
        if (isFinished === Finished.MATE) roomChannel.push("loss", {});
        if (isFinished === Finished.STALEMATE)
          roomChannel.push("remis", { forced: true });
      }
      incrementTime();
      if (status === RoomStatus.SETUP && !isTicking) tickTime(1000);
      status = RoomStatus.PLAYING;
    });

    roomChannel.on("finished", (resp: FinishResponse) => {
      status = RoomStatus[resp.winner];
      openGameFinishedModal = true;
    });

    roomChannel.on("aborted", () => {
      status = RoomStatus.ABORTED;
      openGameFinishedModal = true;
    });

    roomChannel.on("remis_request", (resp: RemisRequestResponse) => {
      if (
        playerType !== PlayerType.SPECTATOR &&
        playerType !== PlayerType[resp.color]
      ) {
        status = RoomStatus.REMIS_REQUESTED;
        message.set("Opponent offered remis");
      }
    });

    roomChannel.on("remis", (resp: RemisResponse) => {
      if (resp.decline) status = RoomStatus.PLAYING;
      else {
        status = RoomStatus.REMIS;
        openGameFinishedModal = true;
      }
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
    if (!gameFinished()) {
      roomChannel.push("move", { board: e.detail });
      hasSent = true;
    }
  }

  function handleAbort() {
    if (roomChannel) roomChannel.push("abort", {});
  }

  function handleRemis() {
    if (roomChannel) roomChannel.push("remis", {});
  }

  function handleRemisDecline() {
    if (roomChannel) roomChannel.push("remis", { decline: true });
  }

  function handleResign() {
    if (roomChannel) roomChannel.push("loss", {});
  }

  function handleTimeout() {
    if (roomChannel) roomChannel.push("timeout", {});
  }

  function tickTime(timeout: number) {
    if (gameFinished()) return;
    if (nextTurn === playerType || playerType === PlayerType.SPECTATOR) {
      if (playerTime > 0) playerTime -= 1;
    } else {
      if (opponentTime > 0) opponentTime -= 1;
    }
    if (roomChannel && (playerTime <= 0 || opponentTime <= 0))
      roomChannel.push("expired", {});
    if (!isTicking) isTicking = true;
    setTimeout(() => tickTime(1000), timeout);
  }

  function incrementTime() {
    if (gameFinished()) return;
    if (nextTurn === playerType || playerType === PlayerType.SPECTATOR) {
      opponentTime += increment;
    } else {
      playerTime += increment;
    }
  }

  function gameFinished(): boolean {
    return (
      status === RoomStatus.WHITE ||
      status === RoomStatus.BLACK ||
      status === RoomStatus.ABORTED ||
      status === RoomStatus.REMIS
    );
  }

  function closeModal() {
    openGameFinishedModal = false;
  }

  function handleReturn() {
    navigate("/");
  }
</script>

<svelte:window bind:innerWidth />

{#if isLoading}
  <!-- TODO: Loading animation -->
  <div id="loader" />
{:else}
  {#if !mobile}
    <div id="invisible" />
  {/if}
  <GameFinishedModal
    open={openGameFinishedModal}
    {status}
    {playerType}
    on:close={closeModal}
    on:return={handleReturn}
  />

  <Board
    {playerType}
    {chessBoard}
    {nextTurn}
    {playerTime}
    {opponentTime}
    {status}
    {roomPresence}
    {mobile}
    on:move={handleMove}
    on:timeout={handleTimeout}
  />
  {#if !mobile}
    <Clock
      {playerTime}
      {opponentTime}
      {status}
      {playerType}
      {roomPresence}
      on:abort={handleAbort}
      on:remis={handleRemis}
      on:remisDeclined={handleRemisDecline}
      on:resign={handleResign}
      on:return={handleReturn}
      on:timeout={handleTimeout}
    />
  {/if}
{/if}

<style>
  #invisible {
    height: 35vh;
    width: 18%;
    display: flex;
    margin: 0 10px;
    padding: 10px 30px;
    border-radius: 10px;
  }
  #loader {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
