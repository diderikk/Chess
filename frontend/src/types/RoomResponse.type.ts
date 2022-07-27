
type RoomResponse = {
	color: String,
	board: String[][],
	nextTurn: String,
	whiteTime: number,
	blackTime: number,
	movePlayed: boolean,
	increment: number
}

export default RoomResponse;