import ChessColor from "../../enums/ChessColor.enum";
import type ChessPiece from "./ChessPiece";
import Bishop from "./pieces/Bishop";
import King from "./pieces/King";
import Knight from "./pieces/Knight";
import Pawn from "./pieces/Pawn";
import Queen from "./pieces/Queen";
import Rook from "./pieces/Rook";

export default class ChessBoard {

  static isFinished(chessBoard: ChessPiece[][]): boolean {
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
