import ChessPiece from "../ChessPiece";
import BlackImage from "../../../assets/pieces/rook_black.png";
import WhiteImage from "../../../assets/pieces/rook_white.png";
import ChessColor from "../../../enums/ChessColor.enum";
import type RowColumn from "../../../types/RowColumn.type";

export default class Rook extends ChessPiece {
  image: any;

  constructor(row: number, column: number, color: ChessColor) {
    super(row, column, color);
    this.image = color === ChessColor.WHITE ? WhiteImage : BlackImage;
  }

  move(board: ChessPiece[][]): ChessPiece[][] {
    throw new Error("Method not implemented.");
  }
  validMoves(board: ChessPiece[][]): RowColumn[] {
    return this.color === ChessColor.WHITE
      ? this.validWhiteMoves(board)
      : this.validBlackMoves(board);
  }

  private validBlackMoves(board: ChessPiece[][]): RowColumn[] {
    const res: RowColumn[] = [];
    const stopDir = [false, false, false, false];
    for (let i = 1; i < 8; i++) {
      // Up
      if (
        !stopDir[0] &&
        this.row + i <= 7 &&
        (!board[this.row + i][this.column] ||
          board[this.row + i][this.column].color === ChessColor.WHITE)
      ) {
        res.push({ row: this.row + i, column: this.column });
        if (board[this.row + i][this.column].color === ChessColor.WHITE)
          stopDir[0] = true;
      } else stopDir[0] = true;
      // Down
      if (
        !stopDir[2] &&
        this.row - i >= 0 &&
        (!board[this.row - i][this.column] ||
          board[this.row - i][this.column].color === ChessColor.WHITE)
      ) {
        res.push({ row: this.row - i, column: this.column });
        if (board[this.row - i][this.column].color === ChessColor.WHITE)
          stopDir[2] = true;
      } else stopDir[2] = true;
      // Right
      if (
        !stopDir[1] &&
        this.column + i <= 7 &&
        (!board[this.row][this.column + i] ||
          board[this.row][this.column + i].color === ChessColor.WHITE)
      ) {
        res.push({ row: this.row, column: this.column + i});
        if (board[this.row][this.column + i].color === ChessColor.WHITE)
          stopDir[1] = true;
      }
			else stopDir[1] = true;
			// Left
			if (
        !stopDir[3] &&
        this.column - i >= 0 &&
        (!board[this.row][this.column - i] ||
          board[this.row][this.column - i].color === ChessColor.WHITE)
      ) {
        res.push({ row: this.row, column: this.column - i});
        if (board[this.row][this.column - i].color === ChessColor.WHITE)
          stopDir[3] = true;
      }
			else stopDir[3] = true;
    }
    return res;
  }

	private validWhiteMoves(board: ChessPiece[][]): RowColumn[]{
		const res: RowColumn[] = [];
    const stopDir = [false, false, false, false];
    for (let i = 1; i < 8; i++) {
      // Up
      if (
        !stopDir[0] &&
        this.row + i <= 7 &&
        (!board[this.row + i][this.column] ||
          board[this.row + i][this.column].color === ChessColor.BLACK)
      ) {
        res.push({ row: this.row + i, column: this.column });
        if (board[this.row + i][this.column].color === ChessColor.BLACK)
          stopDir[0] = true;
      } else stopDir[0] = true;
      // Down
      if (
        !stopDir[2] &&
        this.row - i >= 0 &&
        (!board[this.row - i][this.column] ||
          board[this.row - i][this.column].color === ChessColor.BLACK)
      ) {
        res.push({ row: this.row - i, column: this.column });
        if (board[this.row - i][this.column].color === ChessColor.BLACK)
          stopDir[2] = true;
      } else stopDir[2] = true;
      // Right
      if (
        !stopDir[1] &&
        this.column + i <= 7 &&
        (!board[this.row][this.column + i] ||
          board[this.row][this.column + i].color === ChessColor.BLACK)
      ) {
        res.push({ row: this.row, column: this.column + i});
        if (board[this.row][this.column + i].color === ChessColor.BLACK)
          stopDir[1] = true;
      }
			else stopDir[1] = true;
			// Left
			if (
        !stopDir[3] &&
        this.column - i >= 0 &&
        (!board[this.row][this.column - i] ||
          board[this.row][this.column - i].color === ChessColor.BLACK)
      ) {
        res.push({ row: this.row, column: this.column - i});
        if (board[this.row][this.column - i].color === ChessColor.BLACK)
          stopDir[3] = true;
      }
			else stopDir[3] = true;
    }
    return res;
	}
}
