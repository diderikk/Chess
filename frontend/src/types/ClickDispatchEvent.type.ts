import type ChessPiece from "../utils/chess/ChessPiece";
import type RowColumn from "./RowColumn.type";

type ClickDispatchEvent = {
  chessPiece: ChessPiece;
  validMoves: RowColumn[];
};

export default ClickDispatchEvent;
