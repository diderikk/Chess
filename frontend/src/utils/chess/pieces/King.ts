import ChessPiece from "../ChessPiece";
import BlackImage from "../../../assets/pieces/king_black.png"
import WhiteImage from "../../../assets/pieces/king_white.png"
import ChessColor from "../../../enums/ChessColor.enum";
import type RowColumn from "../../../types/RowColumn.type";

export default class King extends ChessPiece {
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

	// private validBlackMoves(board: ChessPiece[][]): RowColumn[]{
	// 	const res: RowColumn[] = [];
	// 	if(this.row + 1 <= 7){
	// 		if(!board[this.row+1, this.column] || board[this.row+1][this.column].color === ChessColor.WHITE)

	// 	}

	// 	return res;
	// }
}