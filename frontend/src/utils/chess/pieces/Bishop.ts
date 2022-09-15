import ChessPiece from "../ChessPiece";
import BlackImage from "../../../assets/pieces/bishop_black.png";
import WhiteImage from "../../../assets/pieces/bishop_white.png";
import ChessColor from "../../../enums/ChessColor.enum";
import type RowColumn from "../../../types/RowColumn.type";
import King from "./King";

export default class Bishop extends ChessPiece {
  image: any;

  constructor(row: number, column: number, color: ChessColor, moved: number) {
    super(row, column, color, moved);
    this.image = color === ChessColor.WHITE ? WhiteImage : BlackImage;
  }

  protectMoves(board: ChessPiece[][]): RowColumn[] {
    return this.validMoves(board);
  }

  validMoves(board: ChessPiece[][]): RowColumn[] {
    const res: RowColumn[] = [];
    const stopDir = [false, false, false, false];
    const opposingColor =
      this.color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE;

    for (let i = 1; i < 8; i++) {
      // Bottom-right
      if (
        !stopDir[0] &&
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
          stopDir[0] = true;
      } else stopDir[0] = true;
      // Top-left
      if (
        !stopDir[2] &&
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
          stopDir[2] = true;
      } else stopDir[2] = true;
      // Bottom-left
      if (
        !stopDir[1] &&
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
          stopDir[1] = true;
      } else stopDir[1] = true;
      // Top-right
      if (
        !stopDir[3] &&
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
          stopDir[3] = true;
      } else stopDir[3] = true;
    }

    return res;
  }

  toSerialized(): String {
    return this.color === ChessColor.BLACK
      ? `bB${this.moved}`
      : `wB${this.moved}`;
  }
}
