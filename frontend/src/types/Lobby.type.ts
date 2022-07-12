import type ChessColor from "../enums/ChessColor.enum";
import type MinuteIncrement from "./MinuteIncrement.type"

type Lobby = {
	mode: MinuteIncrement;
	color: ChessColor;
}

export default Lobby;