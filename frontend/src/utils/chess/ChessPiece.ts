import type ChessColor from "../../enums/ChessColor.enum";
import type RowColumn from "../../types/RowColumn.type";

export default abstract class ChessPiece {
	column: number;
	row: number;
	color: ChessColor
	abstract image: any;

	constructor(row: number, column: number, color: ChessColor){
		this.column = column;
		this.row = row;
		this.color = color;
	}

	abstract move(board: ChessPiece[][]): ChessPiece[][];

	abstract validMoves(board: ChessPiece[][]): RowColumn[];
}