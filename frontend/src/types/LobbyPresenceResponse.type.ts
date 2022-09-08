type LobbyPresenceContent = {
	ids: LobbyIdentity[],
	metas: []
}


type LobbyIdentity = {
	id: string,
	color: string
}

type LobbyPresenceResponse = {
	[key: string]: LobbyPresenceContent;
}

export default LobbyPresenceResponse;