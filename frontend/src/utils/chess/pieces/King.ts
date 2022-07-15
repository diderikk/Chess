import ChessPiece from "../ChessPiece";
import BlackImage from "../../../assets/pieces/king_black.png";
import WhiteImage from "../../../assets/pieces/king_white.png";
import ChessColor from "../../../enums/ChessColor.enum";
import type RowColumn from "../../../types/RowColumn.type";
import ChessBoard from "../ChessBoard";

export default class King extends ChessPiece {
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
      if (this.moved === 0 && (movePosition.column === this.column + 2 || movePosition.column === this.column + 3)) {
        boardCopy[this.row][this.column + 3].move(
          { row: this.row, column: this.column + 1 },
          board
        );
        movePosition = { row: this.row, column: this.column + 2 };
      } else if (this.moved === 0 && (movePosition.column === this.column - 2 || movePosition.column === this.column - 4)) {
        boardCopy[this.row][this.column - 4].move(
          { row: this.row, column: this.column -1},
          board
        );
        movePosition = { row: this.row, column: this.column - 2 };
      }
      boardCopy[this.row][this.column] = null;
      this.row = movePosition.row;
      this.column = movePosition.column;
      boardCopy[movePosition.row][movePosition.column] = this;
    }
    this.moved += 1;
    return boardCopy;
  }

  protectMoves(board: ChessPiece[][]): RowColumn[] {
    const res: RowColumn[] = [];
    const opposingColor =
      this.color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE;
    // Up
    if (
      this.row + 1 <= 7 &&
      (!board[this.row + 1][this.column] ||
        (board[this.row + 1][this.column] &&
          board[this.row + 1][this.column].color === opposingColor))
    )
      res.push({ row: this.row + 1, column: this.column });
    // Down
    if (
      this.row - 1 >= 0 &&
      (!board[this.row - 1][this.column] ||
        (board[this.row - 1][this.column] &&
          board[this.row - 1][this.column].color === opposingColor))
    )
      res.push({ row: this.row - 1, column: this.column });
    // Right
    if (
      this.column + 1 <= 7 &&
      (!board[this.row][this.column + 1] ||
        (board[this.row][this.column + 1] &&
          board[this.row][this.column + 1].color === opposingColor))
    )
      res.push({ row: this.row, column: this.column + 1 });
    // Left
    if (
      this.column - 1 >= 0 &&
      (!board[this.row][this.column - 1] ||
        (board[this.row][this.column - 1] &&
          board[this.row][this.column - 1].color === opposingColor))
    )
      res.push({ row: this.row, column: this.column - 1 });

    if (
      this.row + 1 <= 7 &&
      this.column + 1 <= 7 &&
      (!board[this.row + 1][this.column + 1] ||
        (board[this.row + 1][this.column + 1] &&
          board[this.row + 1][this.column + 1].color === opposingColor))
    )
      res.push({ row: this.row + 1, column: this.column + 1 });
    // Top-left
    if (
      this.row - 1 >= 0 &&
      this.column - 1 >= 0 &&
      (!board[this.row - 1][this.column - 1] ||
        (board[this.row - 1][this.column - 1] &&
          board[this.row - 1][this.column - 1].color === opposingColor))
    )
      res.push({ row: this.row - 1, column: this.column - 1 });
    // Bottom-left
    if (
      this.row - 1 >= 0 &&
      this.column + 1 <= 7 &&
      (!board[this.row - 1][this.column + 1] ||
        (board[this.row - 1][this.column + 1] &&
          board[this.row - 1][this.column + 1].color === opposingColor))
    )
      res.push({ row: this.row - 1, column: this.column + 1 });
    // Top-right
    if (
      this.row + 1 <= 7 &&
      this.column - 1 >= 0 &&
      (!board[this.row + 1][this.column - 1] ||
        (board[this.row + 1][this.column - 1] &&
          board[this.row + 1][this.column - 1].color === opposingColor))
    )
      res.push({ row: this.row + 1, column: this.column - 1 });

    return res;
  }

  validMoves(board: ChessPiece[][]): RowColumn[] {
    const res: RowColumn[] = [];
    const opposingColor =
      this.color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE;
    // Up
    if (
      this.row + 1 <= 7 &&
      !ChessBoard.isProtected(
        { row: this.row + 1, column: this.column },
        board,
        opposingColor
      ) &&
      (!board[this.row + 1][this.column] ||
        (board[this.row + 1][this.column] &&
          board[this.row + 1][this.column].color === opposingColor))
    )
      res.push({ row: this.row + 1, column: this.column });
    // Down
    if (
      this.row - 1 >= 0 &&
      !ChessBoard.isProtected(
        { row: this.row - 1, column: this.column },
        board,
        opposingColor
      ) &&
      (!board[this.row - 1][this.column] ||
        (board[this.row - 1][this.column] &&
          board[this.row - 1][this.column].color === opposingColor))
    )
      res.push({ row: this.row - 1, column: this.column });
    // Right
    if (
      this.column + 1 <= 7 &&
      !ChessBoard.isProtected(
        { row: this.row, column: this.column + 1 },
        board,
        opposingColor
      ) &&
      (!board[this.row][this.column + 1] ||
        (board[this.row][this.column + 1] &&
          board[this.row][this.column + 1].color === opposingColor))
    )
      res.push({ row: this.row, column: this.column + 1 });
    // Left
    if (
      this.column - 1 >= 0 &&
      !ChessBoard.isProtected(
        { row: this.row, column: this.column - 1 },
        board,
        opposingColor
      ) &&
      (!board[this.row][this.column - 1] ||
        (board[this.row][this.column - 1] &&
          board[this.row][this.column - 1].color === opposingColor))
    )
      res.push({ row: this.row, column: this.column - 1 });

    if (
      this.row + 1 <= 7 &&
      this.column + 1 <= 7 &&
      !ChessBoard.isProtected(
        { row: this.row + 1, column: this.column + 1 },
        board,
        opposingColor
      ) &&
      (!board[this.row + 1][this.column + 1] ||
        (board[this.row + 1][this.column + 1] &&
          board[this.row + 1][this.column + 1].color === opposingColor))
    )
      res.push({ row: this.row + 1, column: this.column + 1 });
    // Top-left
    if (
      this.row - 1 >= 0 &&
      this.column - 1 >= 0 &&
      !ChessBoard.isProtected(
        { row: this.row - 1, column: this.column - 1 },
        board,
        opposingColor
      ) &&
      (!board[this.row - 1][this.column - 1] ||
        (board[this.row - 1][this.column - 1] &&
          board[this.row - 1][this.column - 1].color === opposingColor))
    )
      res.push({ row: this.row - 1, column: this.column - 1 });
    // Bottom-left
    if (
      this.row - 1 >= 0 &&
      this.column + 1 <= 7 &&
      !ChessBoard.isProtected(
        { row: this.row - 1, column: this.column + 1 },
        board,
        opposingColor
      ) &&
      (!board[this.row - 1][this.column + 1] ||
        (board[this.row - 1][this.column + 1] &&
          board[this.row - 1][this.column + 1].color === opposingColor))
    )
      res.push({ row: this.row - 1, column: this.column + 1 });
    // Top-right
    if (
      this.row + 1 <= 7 &&
      this.column - 1 >= 0 &&
      !ChessBoard.isProtected(
        { row: this.row + 1, column: this.column - 1 },
        board,
        opposingColor
      ) &&
      (!board[this.row + 1][this.column - 1] ||
        (board[this.row + 1][this.column - 1] &&
          board[this.row + 1][this.column - 1].color === opposingColor))
    )
      res.push({ row: this.row + 1, column: this.column - 1 });
    // Rokade right
    if (
      this.moved === 0 &&
      !board[this.row][this.column + 1] &&
      !board[this.row][this.column + 2] &&
      board[this.row][this.column + 3] &&
      board[this.row][this.column + 3].moved === 0 &&
      !ChessBoard.isProtected(
        { row: this.row, column: this.column + 1 },
        board,
        opposingColor
      ) &&
      !ChessBoard.isProtected(
        { row: this.row, column: this.column + 2 },
        board,
        opposingColor
      )
    ) {
      res.push({ row: this.row, column: this.column + 2 });
      res.push({ row: this.row, column: this.column + 3 });
    }

    //Rocade left
    if (
      this.moved === 0 &&
      !board[this.row][this.column - 1] &&
      !board[this.row][this.column - 2] &&
      !board[this.row][this.column - 3] &&
      board[this.row][this.column - 4] &&
      board[this.row][this.column - 4].moved === 0 &&
      !ChessBoard.isProtected(
        { row: this.row, column: this.column - 1 },
        board,
        opposingColor
      ) &&
      !ChessBoard.isProtected(
        { row: this.row, column: this.column - 2 },
        board,
        opposingColor
      ) &&
      !ChessBoard.isProtected(
        { row: this.row, column: this.column - 3 },
        board,
        opposingColor
      )
    ) {
      res.push({ row: this.row, column: this.column - 2 });
      res.push({ row: this.row, column: this.column - 4 });
    }
    return res;
  }

  toSerialized(): String {
    return this.color === ChessColor.BLACK ? "bK" : "wK"
}
}
