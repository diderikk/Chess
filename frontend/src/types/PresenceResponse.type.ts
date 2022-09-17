type LobbyPresenceContent = {
  ids: LobbyIdentity[];
  metas: [];
};

type LobbyIdentity = {
  id: string;
  color: string;
};

type LobbyPresenceResponse = {
  [key: string]: LobbyPresenceContent;
};

type RoomPresenceResponse = {
  roomId: string;
  mode: string;
};

type PresenceResponse = {
  lobbies: LobbyPresenceResponse;
  rooms: RoomPresenceResponse[];
};

export default PresenceResponse;
