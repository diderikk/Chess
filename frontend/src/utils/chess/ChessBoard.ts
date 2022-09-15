import ChessColor from "../../enums/ChessColor.enum";
import Finished from "../../enums/Finished.enum";
import PlayerType from "../../enums/PlayerType.enum";
import type RowColumn from "../../types/RowColumn.type";
import type ChessPiece from "./ChessPiece";
import Bishop from "./pieces/Bishop";
import King from "./pieces/King";
import Knight from "./pieces/Knight";
import Pawn from "./pieces/Pawn";
import Queen from "./pieces/Queen";
import Rook from "./pieces/Rook";

export default class ChessBoard {
  static isFinished(turn: ChessColor, board: ChessPiece[][]): Finished {
    let validMoves: RowColumn[] = [];
    if (this.isChecked(turn, board)) {
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] && board[i][j].color === turn) {
            validMoves = [
              ...validMoves,
              ...ChessBoard.filterValidMovesChecked(board[i][j], board),
            ];
          }
        }
      }
      if (validMoves.length === 0) return Finished.MATE;
    } else {
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (board[i][j] && board[i][j].color === turn) {
            validMoves = [...validMoves, ...board[i][j].validMoves(board)];
          }
        }
      }
      if (validMoves.length === 0) return Finished.STALEMATE;
    }

    return Finished.NONE;
  }

  static isChecked(turn: ChessColor, board: ChessPiece[][]): boolean {
    let king: ChessPiece = null;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (
          board[i][j] &&
          board[i][j].color === turn &&
          board[i][j] instanceof King
        ) {
          king = board[i][j];
          break;
        }
      }
    }

    if (king === null) throw Error("King is missing");

    const opposingColor =
      turn === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE;

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (
          board[i][j] &&
          board[i][j].color === opposingColor &&
          !(board[i][j] instanceof King) &&
          board[i][j]
            .protectMoves(board)
            .filter(
              (validMove) =>
                validMove.row === king.row && validMove.column === king.column
            ).length > 0
        )
          return true;
      }
    }
    return false;
  }

  static filterValidMovesChecked(piece: ChessPiece, board: ChessPiece[][]) {
    let king: ChessPiece = null;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (
          board[i][j] &&
          board[i][j].color === piece.color &&
          board[i][j] instanceof King
        ) {
          king = board[i][j];
          break;
        }
      }
    }

    if (king === null) throw Error("King is missing");
    const validMoves = piece.validMoves(board);
    const initialPosition = {
      row: piece.row,
      column: piece.column,
    } as RowColumn;
    const opposingColor =
      piece.color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE;

    return validMoves.filter((validMove) => {
      const temp = board[validMove.row][validMove.column];
      board = piece.testMove(validMove, board);
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (
            board[i][j] &&
            board[i][j].color === opposingColor &&
            !(board[i][j] instanceof King) &&
            board[i][j]
              .protectMoves(board)
              .filter(
                (validMove) =>
                  validMove.row === king.row && validMove.column === king.column
              ).length > 0
          ) {
            board = piece.testMove(initialPosition, board);
            if (temp) board[validMove.row][validMove.column] = temp;
            return false;
          }
        }
      }
      board = piece.testMove(initialPosition, board);
      if (temp) board[validMove.row][validMove.column] = temp;
      return true;
    });
  }

  static isProtected(
    position: RowColumn,
    chessBoard: ChessPiece[][],
    opposingColor: ChessColor
  ): boolean {
    const boardCopy = [...chessBoard];
    const chessPiece = chessBoard[position.row][position.column];
    if (chessPiece) {
      if (chessPiece.color !== opposingColor) return false;
      chessPiece.color =
        chessPiece.color === ChessColor.WHITE
          ? ChessColor.BLACK
          : ChessColor.WHITE;
      //TODO: Check if it works without
      boardCopy[position.row][position.column] = chessPiece;
    }

    for (let i = 0; i < boardCopy.length; i++) {
      for (let j = 0; j < boardCopy[i].length; j++) {
        if (
          boardCopy[i][j] &&
          boardCopy[i][j].color === opposingColor &&
          boardCopy[i][j]
            .protectMoves(boardCopy)
            .filter(
              (validMove) =>
                validMove.row === position.row &&
                validMove.column === position.column
            ).length > 0
        ) {
          if (chessPiece)
            chessPiece.color =
              chessPiece.color === ChessColor.WHITE
                ? ChessColor.BLACK
                : ChessColor.WHITE;
          return true;
        }
      }
    }
    if (chessPiece)
      chessPiece.color =
        chessPiece.color === ChessColor.WHITE
          ? ChessColor.BLACK
          : ChessColor.WHITE;
    return false;
  }

  static serializeBoard(
    chessBoard: ChessPiece[][],
    playerType: PlayerType
  ): String[][] {
    const board: String[][] = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));
    for (let row = 0; row < chessBoard.length; row++) {
      for (let col = 0; col < chessBoard[row].length; col++) {
        const boardCol = playerType === PlayerType.BLACK ? 7 - col : col;
        board[row][boardCol] = this.serializePiece(chessBoard[row][col]);
      }
    }
    return playerType === PlayerType.BLACK ? board : board.reverse();
  }

  static deserializeBoard(
    stringBoard: String[][],
    playerType: PlayerType
  ): ChessPiece[][] {
    console.log(stringBoard);
    console.log(playerType);
    const board: ChessPiece[][] = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));
    for (let row = 0; row < stringBoard.length; row++) {
      for (let col = 0; col < stringBoard[row].length; col++) {
        const boardRow = playerType === PlayerType.BLACK ? row : 7 - row;
        const boardCol = playerType === PlayerType.BLACK ? 7 - col : col;
        board[boardRow][boardCol] = this.deserializePiece(
          stringBoard[row][col],
          boardRow,
          boardCol
        );
      }
    }

    return board;
  }

  private static deserializePiece(
    piece: String,
    row: number,
    column: number
  ): ChessPiece {
    if (piece === null) return null;
    const color = piece[0] === "w" ? ChessColor.WHITE : ChessColor.BLACK;
    const pieceType = piece[1];
    const moved = parseInt(piece.substring(2));
    switch (pieceType) {
      case "B":
        return new Bishop(row, column, color, moved);
      case "K":
        return new King(row, column, color, moved);
      case "H":
        return new Knight(row, column, color, moved);
      case "P":
        return new Pawn(row, column, color, moved);
      case "Q":
        return new Queen(row, column, color, moved);
      case "R":
        return new Rook(row, column, color, moved);
      default:
        throw new Error(`Could not deserialize piece: ${piece}`);
    }
  }

  private static serializePiece(piece: ChessPiece): String {
    if (piece === null) return null;
    return piece.toSerialized();
  }
}
