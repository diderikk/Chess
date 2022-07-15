enum PlayerType {
	WHITE, BLACK, SPECTATOR
}

export const valueOf = (type: String): PlayerType => {
	switch(type){
		case "WHITE":
			return PlayerType.WHITE
		case "BLACK":
			return PlayerType.BLACK
		default:
			return PlayerType.SPECTATOR
	}
}

export default PlayerType;