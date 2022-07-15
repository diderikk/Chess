import ChessPiece from "../ChessPiece";
import BlackImage from "../../../assets/pieces/pawn_black.png";
import WhiteImage from "../../../assets/pieces/pawn_white.png";
import ChessColor from "../../../enums/ChessColor.enum";
import type RowColumn from "../../../types/RowColumn.type";

export default class Pawn extends ChessPiece {
  image: any;

  constructor(row: number, column: number, color: ChessColor) {
    super(row, column, color);
    this.image = color === ChessColor.WHITE ? WhiteImage : BlackImage;
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
      if (
        movePosition.column === this.column + 1 &&
        movePosition.row === this.row + 1 &&
        !board[this.row + 1][this.column + 1]
      ) {
        board[this.row][this.column + 1] = null;
      }
      if (
        movePosition.column === this.column - 1 &&
        movePosition.row === this.row + 1 &&
        !board[this.row + 1][this.column - 1]
      ) {
        board[this.row][this.column - 1] = null;
      }
      if (
        movePosition.column === this.column + 1 &&
        movePosition.row === this.row - 1 &&
        !board[this.row - 1][this.column + 1]
      ) {
        board[this.row][this.column + 1] = null;
      }
      if (
        movePosition.column === this.column - 1 &&
        movePosition.row === this.row - 1 &&
        !board[this.row - 1][this.column - 1]
      ) {
        board[this.row][this.column - 1] = null;
      }
      boardCopy[this.row][this.column] = null;
      this.row = movePosition.row;
      this.column = movePosition.column;
      boardCopy[movePosition.row][movePosition.column] = this;
    }
    this.moved += 1;
    return boardCopy;
  }

  validMoves(board: ChessPiece[][]): RowColumn[] {
    const res: RowColumn[] = [];
    const opposingColor =
      this.color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE;
    // Row above
    if (!board[this.row - 1][this.column])
      res.push({ row: this.row - 1, column: this.column });
    // Row two above if the piece is at start
    if (
      !board[this.row - 2][this.column] &&
      !board[this.row - 1][this.column] &&
      this.row === 6
    )
      res.push({ row: this.row - 2, column: this.column });
    // Take opposing color piece on the left
    if (
      board[this.row - 1][this.column - 1] &&
      board[this.row - 1][this.column - 1].color === opposingColor
    )
      res.push({ row: this.row - 1, column: this.column - 1 });
    if (
      board[this.row - 1][this.column + 1] &&
      board[this.row - 1][this.column + 1].color === opposingColor
    )
      res.push({ row: this.row - 1, column: this.column + 1 });

    if (
      board[this.row][this.column + 1] &&
      board[this.row][this.column + 1].color === opposingColor &&
      board[this.row][this.column + 1] instanceof Pawn &&
      this.row === 3 &&
      board[this.row][this.column + 1].moved === 1
    )
      res.push({ row: this.row - 1, column: this.column + 1 });
    if (
      board[this.row][this.column - 1] &&
      board[this.row][this.column - 1].color === opposingColor &&
      board[this.row][this.column - 1] instanceof Pawn &&
      this.row === 3   &&
      board[this.row][this.column - 1].moved === 1
    )
      res.push({ row: this.row - 1, column: this.column - 1 });
    return res;
  }


  protectMoves(): RowColumn[] {
    return [
      { row: this.row - 1, column: this.column - 1 },
      { row: this.row - 1, column: this.column + 1 },
    ];
  }

  toSerialized(): String {
    return this.color === ChessColor.BLACK ? "bP" : "wP"
}
}
