import ChessColor from "../../../enums/ChessColor.enum";
import ChessPiece from "../ChessPiece";
import BlackImage from "../../../assets/pieces/queen_black.png";
import WhiteImage from "../../../assets/pieces/queen_white.png";
import type RowColumn from "../../../types/RowColumn.type";
import King from "./King";

export default class Queen extends ChessPiece {
  image: any;

  constructor(row: number, column: number, color: ChessColor) {
    super(row, column, color);
    this.image = color === ChessColor.WHITE ? WhiteImage : BlackImage;
  }

  protectMoves(board: ChessPiece[][]): RowColumn[] {
    return this.validMoves(board);
  }

  validMoves(board: ChessPiece[][]): RowColumn[] {
    const res: RowColumn[] = [];
    const stopDir = Array(8).fill(false);
    const opposingColor =
      this.color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE;
    for (let i = 1; i < 8; i++) {
      // Up
      if (
        !stopDir[0] &&
        this.row + i <= 7 &&
        (!board[this.row + i][this.column] ||
          (board[this.row + i][this.column] &&
            board[this.row + i][this.column].color === opposingColor))
      ) {
        res.push({ row: this.row + i, column: this.column });
        if (
          board[this.row + i][this.column] &&
          !(board[this.row + i][this.column] instanceof King)
        )
          stopDir[0] = true;
      } else stopDir[0] = true;
      // Down
      if (
        !stopDir[2] &&
        this.row - i >= 0 &&
        (!board[this.row - i][this.column] ||
          (board[this.row - i][this.column] &&
            board[this.row - i][this.column].color === opposingColor))
      ) {
        res.push({ row: this.row - i, column: this.column });
        if (
          board[this.row - i][this.column] &&
          !(board[this.row - i][this.column] instanceof King)
        )
          stopDir[2] = true;
      } else stopDir[2] = true;
      // Right
      if (
        !stopDir[1] &&
        this.column + i <= 7 &&
        (!board[this.row][this.column + i] ||
          (board[this.row][this.column + i] &&
            board[this.row][this.column + i].color === opposingColor))
      ) {
        res.push({ row: this.row, column: this.column + i });
        if (
          board[this.row][this.column + i] &&
          !(board[this.row][this.column + i] instanceof King)
        )
          stopDir[1] = true;
      } else stopDir[1] = true;
      // Left
      if (
        !stopDir[3] &&
        this.column - i >= 0 &&
        (!board[this.row][this.column - i] ||
          (board[this.row][this.column - i] &&
            board[this.row][this.column - i].color === opposingColor))
      ) {
        res.push({ row: this.row, column: this.column - i });
        if (
          board[this.row][this.column - i] &&
          !(board[this.row][this.column - i] instanceof King)
        )
          stopDir[3] = true;
      } else stopDir[3] = true;

      if (
        !stopDir[4] &&
        this.row + i <= 7 &&
        this.column + i <= 7 &&
        (!board[this.row + i][this.column + i] ||
          (board[this.row + i][this.column + i] &&
            board[this.row + i][this.column + i].color === opposingColor))
      ) {
        res.push({ row: this.row + i, column: this.column + i });
        if (
          board[this.row + i][this.column + i] &&
          !(board[this.row + i][this.column + i] instanceof King)
        )
          stopDir[4] = true;
      } else stopDir[4] = true;
      // Top-left
      if (
        !stopDir[5] &&
        this.row - i >= 0 &&
        this.column - i >= 0 &&
        (!board[this.row - i][this.column - i] ||
          (board[this.row - i][this.column - i] &&
            board[this.row - i][this.column - i].color === opposingColor))
      ) {
        res.push({ row: this.row - i, column: this.column - i });
        if (
          board[this.row - i][this.column - i] &&
          !(board[this.row - i][this.column - i] instanceof King)
        )
          stopDir[5] = true;
      } else stopDir[5] = true;
      // Bottom-left
      if (
        !stopDir[6] &&
        this.row - i >= 0 &&
        this.column + i <= 7 &&
        (!board[this.row - i][this.column + i] ||
          (board[this.row - i][this.column + i] &&
            board[this.row - i][this.column + i].color === opposingColor))
      ) {
        res.push({ row: this.row - i, column: this.column + i });
        if (
          board[this.row - i][this.column + i] &&
          !(board[this.row - i][this.column + i] instanceof King)
        )
          stopDir[6] = true;
      } else stopDir[6] = true;
      // Top-right
      if (
        !stopDir[7] &&
        this.row + i <= 7 &&
        this.column - i >= 0 &&
        (!board[this.row + i][this.column - i] ||
          (board[this.row + i][this.column - i] &&
            board[this.row + i][this.column - i].color === opposingColor))
      ) {
        res.push({ row: this.row + i, column: this.column - i });
        if (
          board[this.row + i][this.column - i] &&
          !(board[this.row + i][this.column - i] instanceof King)
        )
          stopDir[7] = true;
      } else stopDir[7] = true;
    }
    return res;
  }

  toSerialized(): String {
    return this.color === ChessColor.BLACK ? "bQ" : "wQ"
}
}
