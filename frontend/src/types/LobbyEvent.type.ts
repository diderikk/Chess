import type ChessColor from "../enums/ChessColor.enum";
import type MinuteIncrement from "./MinuteIncrement.type";

type LobbyEvent = {
  mode: string;
  color: ChessColor;
};

export default LobbyEvent;
