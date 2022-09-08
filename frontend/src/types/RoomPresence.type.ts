type RoomPresence = {
	color: string,
	metas:	RoomPresenceMeta[]
}

type RoomPresenceMeta = {
	phx_ref: string
}

export default RoomPresence;