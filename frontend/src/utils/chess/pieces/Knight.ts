import ChessPiece from "../ChessPiece";
import BlackImage from "../../../assets/pieces/knight_black.png";
import WhiteImage from "../../../assets/pieces/knight_white.png";
import ChessColor from "../../../enums/ChessColor.enum";
import type RowColumn from "../../../types/RowColumn.type";

export default class Knight extends ChessPiece {
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
    const opposingColor =
      this.color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE;
    if (
      this.row + 1 <= 7 &&
      this.column + 2 <= 7 &&
      (!board[this.row + 1][this.column + 2] ||
        board[this.row + 1][this.column + 2].color === opposingColor)
    )
      res.push({ row: this.row + 1, column: this.column + 2 });
    if (
      this.row + 2 <= 7 &&
      this.column + 1 <= 7 &&
      (!board[this.row + 2][this.column + 1] ||
        board[this.row + 2][this.column + 1].color === opposingColor)
    )
      res.push({ row: this.row + 2, column: this.column + 1 });
    if (
      this.row + 2 <= 7 &&
      this.column - 1 >= 0 &&
      (!board[this.row + 2][this.column - 1] ||
        board[this.row + 2][this.column - 1].color === opposingColor)
    )
      res.push({ row: this.row + 2, column: this.column - 1 });
    if (
      this.row + 1 <= 7 &&
      this.column - 2 >= 0 &&
      (!board[this.row + 1][this.column - 2] ||
        board[this.row + 1][this.column - 2].color === opposingColor)
    )
      res.push({ row: this.row + 1, column: this.column - 2 });
    if (
      this.row - 1 >= 0 &&
      this.column - 2 >= 0 &&
      (!board[this.row - 1][this.column - 2] ||
        board[this.row - 1][this.column - 2].color === opposingColor)
    )
      res.push({ row: this.row - 1, column: this.column - 2 });
    if (
      this.row - 2 >= 0 &&
      this.column - 1 >= 0 &&
      (!board[this.row - 2][this.column - 1] ||
        board[this.row - 2][this.column - 1].color === opposingColor)
    )
      res.push({ row: this.row - 2, column: this.column - 1 });
    if (
      this.row - 2 >= 0 &&
      this.column + 1 <= 7 &&
      (!board[this.row - 2][this.column + 1] ||
        board[this.row - 2][this.column + 1].color === opposingColor)
    )
      res.push({ row: this.row - 2, column: this.column + 1 });
    if (
      this.row - 1 >= 0 &&
      this.column + 2 <= 7 &&
      (!board[this.row - 1][this.column + 2] ||
        board[this.row - 1][this.column + 2].color === opposingColor)
    )
      res.push({ row: this.row - 1, column: this.column + 2 });

    return res;
  }

  toSerialized(): String {
    return this.color === ChessColor.BLACK
      ? `bH${this.moved}`
      : `wH${this.moved}`;
  }
}
