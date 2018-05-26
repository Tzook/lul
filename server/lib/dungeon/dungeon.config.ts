export default {
	ROUTES: {
		GENERATE: "/dungeons/generate"
	},
	LOGS: {
		GENERATE_DUNGEONS: {
			MSG: "Generated dungeon successfully.",
			CODE: "DUNGEON_1",
			STATUS: "OK"
		}
	},
	SERVER_INNER: {
	},
	SERVER_GETS: {
		"DUNGEON_START": {"name": "started_dungeon", "alive": true, "log": true},		
	},
	CLIENT_GETS: {},
	DUNGEON_PARTY_SIZE: 5,
}