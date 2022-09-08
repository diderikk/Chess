import type RoomStatus from "../enums/RoomStatus.enum";

type RoomResponse = {
	color: string,
	board: string[][],
	nextTurn: string,
	whiteTime: number,
	blackTime: number,
	increment: number,
	status: string
}

export default RoomResponse;