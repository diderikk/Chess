import ChessColor from "../../../enums/ChessColor.enum";
import ChessPiece from "../ChessPiece";
import BlackImage from "../../../assets/pieces/queen_black.png"
import WhiteImage from "../../../assets/pieces/queen_white.png"
import type RowColumn from "../../../types/RowColumn.type";

export default class Queen extends ChessPiece {
	image: any;

	constructor(row: number, column: number, color: ChessColor){
		super(row, column, color)
		this.image = color === ChessColor.WHITE ? WhiteImage : BlackImage;
	}

	move(board: ChessPiece[][]): ChessPiece[][] {
		throw new Error("Method not implemented.");
	}
	validMoves(board: ChessPiece[][]): RowColumn[] {
		throw new Error("Method not implemented.");
	}
}