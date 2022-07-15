<script lang="ts">
  import type RowColumn from "../types/RowColumn.type";
  import ChessBoard from "../utils/chess/ChessBoard";
  import Piece from "./Piece.svelte";
  import type ChessPiece from "../utils/chess/ChessPiece";
  import King from "../utils/chess/pieces/King";
  import PlayerType from "../enums/PlayerType.enum";
  import ChessColor from "../enums/ChessColor.enum";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let playerType: PlayerType = PlayerType.SPECTATOR;
  export let chessBoard: ChessPiece[][] = null;
  export let nextTurn: PlayerType = PlayerType.SPECTATOR;
  let validMoves: RowColumn[] = [];
  let selectedPiece: ChessPiece = null;
  console.log(PlayerType[nextTurn])

  function handleShowValidMoves(e: CustomEvent<ChessPiece>) {
    selectedPiece = e.detail;
    const playersPiece =
      e.detail &&
      PlayerType[playerType] === ChessColor[e.detail.color] &&
      nextTurn === playerType;
    if (
      e.detail &&
      ChessBoard.isChecked(e.detail.color, chessBoard) &&
      playersPiece
    ) {
      validMoves = ChessBoard.filterValidMovesChecked(e.detail, [
        ...chessBoard,
      ]);
    } else if (e.detail && playersPiece)
      validMoves = e.detail.validMoves([...chessBoard]);
    else validMoves = [];
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
        on:showValidMoves={handleShowValidMoves}
        on:move={handleMove}
      />
    {/each}
  {/each}
</div>

<style>
  #board {
    height: 70vh;
    width: 70vh;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr);
  }
</style>
