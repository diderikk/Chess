import ChessColor from "../../enums/ChessColor.enum";
import Finished from "../../enums/Finished.enum";
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

    const validMoves: RowColumn[] = [];
    if(this.isChecked(turn, board)){
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (
            board[i][j] &&
            board[i][j].color === turn
          ) {
            [...validMoves, ChessBoard.filterValidMovesChecked(board[i][j], board)]
          }
        }
      }
      if(validMoves.length === 0) return Finished.MATE
    }
    else{
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
          if (
            board[i][j] &&
            board[i][j].color === turn
          ) {
            [...validMoves, board[i][j].validMoves(board)]
          }
        }
      }
      if(validMoves.length === 0) return Finished.STALEMATE
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

  static initializeBoard(): ChessPiece[][] {
    return Array(8)
      .fill([])
      .map((_, row) => {
        // All middle rows are empty
        if (row > 1 && row <= 5) return Array(8).fill(null);
        else if (row === 1 || row === 6) {
          // Pawn rows
          if (row === 1)
            return Array(8)
              .fill(null)
              .map((_, column) => new Pawn(row, column, ChessColor.WHITE));
          return Array(8)
            .fill(null)
            .map((_, column) => new Pawn(row, column, ChessColor.BLACK));
        } else {
          if (row === 0)
            return [
              new Rook(row, 0, ChessColor.WHITE),
              new Knight(row, 1, ChessColor.WHITE),
              new Bishop(row, 2, ChessColor.WHITE),
              new Queen(row, 3, ChessColor.WHITE),
              new King(row, 4, ChessColor.WHITE),
              new Bishop(row, 5, ChessColor.WHITE),
              new Knight(row, 6, ChessColor.WHITE),
              new Rook(row, 7, ChessColor.WHITE),
            ];
          return [
            new Rook(row, 0, ChessColor.BLACK),
            new Knight(row, 1, ChessColor.BLACK),
            new Bishop(row, 2, ChessColor.BLACK),
            new Queen(row, 3, ChessColor.BLACK),
            new King(row, 4, ChessColor.BLACK),
            new Bishop(row, 5, ChessColor.BLACK),
            new Knight(row, 6, ChessColor.BLACK),
            new Rook(row, 7, ChessColor.BLACK),
          ];
        }
      });
  }
}
