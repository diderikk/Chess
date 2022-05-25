<script lang="ts">
  import type RowColumn from "../types/RowColumn.type";

  import ChessBoard from "../utils/chess/ChessBoard";
  import Piece from "./Piece.svelte";
  import type ChessPiece from "../utils/chess/ChessPiece";
  import King from "../utils/chess/pieces/King";

  let chessBoard = ChessBoard.initializeBoard();
  let validMoves: RowColumn[] = [];
  let selectedPiece: ChessPiece = null;

  function handleShowValidMoves(e: CustomEvent<ChessPiece>) {
    selectedPiece = e.detail;
    if(e.detail && ChessBoard.isChecked(e.detail.color, chessBoard)){
      validMoves = ChessBoard.filterValidMovesChecked(e.detail, [...chessBoard]);
    }
    else if (e.detail) validMoves = e.detail.validMoves([...chessBoard]);
    else validMoves = [];
  }

  function handleMove(e: CustomEvent<RowColumn>) {
    const newBoard = selectedPiece.move(e.detail, chessBoard);
    selectedPiece = null;
    validMoves = [];
    chessBoard = newBoard;
  }

  function isChecked(piece: ChessPiece): boolean {
    return (
      piece instanceof King && ChessBoard.isChecked(piece.color, [...chessBoard])
    );
  }

</script>

<div>
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
  div {
    height: 70vh;
    width: 70vh;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    grid-template-rows: repeat(8, 1fr);
  }
</style>
