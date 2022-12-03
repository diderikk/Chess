<script lang="ts">
  import type RowColumn from "../types/RowColumn.type";
  import ChessBoard from "../utils/chess/ChessBoard";
  import Piece from "./Piece.svelte";
  import type ChessPiece from "../utils/chess/ChessPiece";
  import King from "../utils/chess/pieces/King";
  import PlayerType from "../enums/PlayerType.enum";
  import ChessColor from "../enums/ChessColor.enum";
  import { createEventDispatcher } from "svelte";
  import RoomStatus from "../enums/RoomStatus.enum";
  import type RoomPresence from "../types/RoomPresence.type";

  const dispatch = createEventDispatcher();

  export let playerType: PlayerType = PlayerType.SPECTATOR;
  export let chessBoard: ChessPiece[][] = null;
  export let nextTurn: PlayerType = PlayerType.SPECTATOR;
  export let playerTime: number = 0;
  export let opponentTime: number = 0;
  export let status: RoomStatus = RoomStatus.SETUP;
  export let roomPresence: RoomPresence[] = [];
  export let mobile: boolean = false;
  let validMoves: RowColumn[] = [];
  let selectedPiece: ChessPiece = null;

  let awayTimer: number = 30;
  let isTicking: boolean = false;

  function addLeadingZero(number: number) {
    if (number < 10) return `0${number}`;
    return number.toString();
  }

  function formatTime(time: number) {
    return `${addLeadingZero(Math.trunc(time / 60))}:${addLeadingZero(
      time % 60
    )}`;
  }

  function getPlayerActivity(roomPresence: RoomPresence[]): boolean[] {
    const activities = Array(2).fill(false);
    roomPresence.forEach((presence) => {
      if (PlayerType[presence.color] === playerType) activities[0] = true;
      if (
        PlayerType[presence.color] !== playerType &&
        PlayerType[presence.color] !== PlayerType.SPECTATOR
      )
        activities[1] = true;
    });
    if (
      !activities[1] &&
      (status === RoomStatus.PLAYING ||
        status === RoomStatus.REMIS_REQUESTED ||
        status === RoomStatus.SETUP)
    ) {
      if (!isTicking) {
        isTicking = true;
        tickAwayTime();
      }
    } else {
      isTicking = false;
      awayTimer = 30;
    }
    return activities;
  }

  function tickAwayTime() {
    if (isTicking) {
      if (awayTimer === 0) {
        dispatch("timeout");
      } else {
        awayTimer -= 1;
        setTimeout(() => tickAwayTime(), 1000);
      }
    }
  }

  function handleShowValidMoves(e: CustomEvent<ChessPiece>) {
    if (selectedPiece === e.detail) {
      validMoves = [];
      selectedPiece = null;
      return;
    }
    selectedPiece = e.detail;
    const playersPiece =
      e.detail &&
      PlayerType[playerType] === ChessColor[e.detail.color] &&
      nextTurn === playerType;
    if (e.detail && playersPiece) {
      validMoves = ChessBoard.filterValidMovesChecked(e.detail, [
        ...chessBoard,
      ]);
    } else validMoves = [];
  }

  function handleDragShowValidMoves(e: CustomEvent<ChessPiece>) {
    selectedPiece = e.detail;
    const playersPiece =
      e.detail &&
      PlayerType[playerType] === ChessColor[e.detail.color] &&
      nextTurn === playerType;
    if (e.detail && playersPiece) {
      validMoves = ChessBoard.filterValidMovesChecked(e.detail, [
        ...chessBoard,
      ]);
    } else validMoves = [];
  }

  function handleMove(e: CustomEvent<RowColumn>) {
    const newBoard = selectedPiece.move(e.detail, chessBoard);
    selectedPiece = null;
    validMoves = [];
    chessBoard = newBoard;
    dispatch("move", ChessBoard.serializeBoard(newBoard, playerType));
  }

  function isChecked(piece: ChessPiece): boolean {
    return (
      piece instanceof King &&
      ChessBoard.isChecked(piece.color, [...chessBoard])
    );
  }
</script>

<div>
  {#if mobile}
    <div class="row">
      <div class="activity-container">
        <div
          class="activity-ball"
          style="background-color: {getPlayerActivity(roomPresence)[1]
            ? 'green'
            : 'grey'}"
        />
        <h3>Anonymous</h3>
        <h3 hidden={awayTimer === 30} class="timer">{awayTimer}</h3>
      </div>
      <h3>{formatTime(opponentTime)}</h3>
    </div>
  {/if}
  <div id="board">
    {#each chessBoard as row, rowIndex}
      {#each row as column, columnIndex}
        <Piece
          piece={column}
          row={rowIndex}
          column={columnIndex}
          validMove={validMoves.filter(
            (rowCol) => rowCol.row === rowIndex && rowCol.column === columnIndex
          ).length > 0}
          isChecked={isChecked(column)}
          {playerType}
          on:showValidMoves={handleShowValidMoves}
          on:showDragValidMoves={handleDragShowValidMoves}
          on:move={handleMove}
        />
      {/each}
    {/each}
  </div>
  {#if mobile}
    <div class="row">
      <div class="activity-container">
        <div
          class="activity-ball"
          style="background-color: {getPlayerActivity(roomPresence)[0]
            ? 'green'
            : 'grey'}"
        />
        <h3>Anonymous</h3>
      </div>
      <h3>{formatTime(playerTime)}</h3>
    </div>
  {/if}
</div>

<style>
  #board {
    height: 70vh;
    width: 70vh;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr);
  }
  .activity-container {
    display: flex;
    align-items: center;
    text-align: center;
    line-height: 0px;
  }
  .activity-ball {
    height: 1rem;
    width: 1rem;
    margin-right: 5px;
    border-radius: 50%;
  }
  .row {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
</style>
