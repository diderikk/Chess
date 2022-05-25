import type ChessColor from "../../enums/ChessColor.enum";
import type RowColumn from "../../types/RowColumn.type";

export default abstract class ChessPiece {
  column: number;
  row: number;
  color: ChessColor;
  moved: number;
  abstract image: any;

  constructor(row: number, column: number, color: ChessColor) {
    this.column = column;
    this.row = row;
    this.color = color;
    this.moved = 0;
  }

  move(movePosition: RowColumn, board: ChessPiece[][]): ChessPiece[][] {
    const boardCopy = [...board];
    if (
      this.validMoves(boardCopy).filter(
        (validMove) =>
          validMove.row === movePosition.row &&
          validMove.column === movePosition.column
      ).length > 0
    ) {
      boardCopy[this.row][this.column] = null;
      this.row = movePosition.row;
      this.column = movePosition.column;
      boardCopy[movePosition.row][movePosition.column] = this;
    }
    this.moved += 1;
    return boardCopy;
  }

  testMove(movePosition: RowColumn, board: ChessPiece[][]): ChessPiece[][] {
    const boardCopy = [...board];
    boardCopy[this.row][this.column] = null;
    this.row = movePosition.row;
    this.column = movePosition.column;
    boardCopy[movePosition.row][movePosition.column] = this;
    return boardCopy;
  }

  abstract validMoves(board: ChessPiece[][]): RowColumn[];

  abstract protectMoves(board: ChessPiece[][]): RowColumn[];

  toString() {
    return `${this.row}:${this.column} - ${this.color}`;
  }
}
