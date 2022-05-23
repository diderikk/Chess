<script lang="ts">
  import type RowColumn from "../types/RowColumn.type";

  import ChessBoard from "../utils/chess/ChessBoard";
  import ChessPiece from "./ChessPiece.svelte";

  let chessBoard = ChessBoard.initializeBoard();
  let validMoves: RowColumn[] = [];

  function handleShowValidMoves(e: CustomEvent<RowColumn[]>) {
    validMoves = e.detail;
  }

</script>

<div>
  {#each chessBoard as row, rowIndex}
    {#each row as column, columnIndex}
      <ChessPiece
        board={chessBoard}
        piece={column}
        index={rowIndex + columnIndex}
        validMove={validMoves.filter(
          (rowCol) => rowCol.row === rowIndex && rowCol.column === columnIndex
        ).length > 0}
        on:click={handleShowValidMoves}
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
