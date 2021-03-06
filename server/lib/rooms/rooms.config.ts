export default {
	"ROUTES": {
		"GENERATE": "/room/generate"
	},
	"LOGS": {
		"GENERATE_ROOM": {
			"MSG": "Generated room successfully.",
			"CODE": "ROOM_1",
			"STATUS": "OK"
		}
	},
	"SERVER_INNER": {
		"MOVE_TO_TOWN": {"name": "move_to_town"},
        "MOVE_ROOM": {"name": "move_room"},
		"LEFT_ROOM": {"name": "left_room", "log": true}
	},
	"SERVER_GETS": {
		"STUCK": {"name": "stuck", "log": true},
		"ENTERED_ROOM": {"name": "entered_room", "log": true},
		"ENTER_PORTAL": {"name": "entered_portal", "alive": true, "log": true},
		"BITCH_PLEASE": {"name": "bitch_please", "log": true},
		"DISCONNECT": {"name": "disconnect"}
	},
	"CLIENT_GETS": {
		"JOIN_ROOM": {"name": "actor_join_room"},
		"MOVE_ROOM": {"name": "actor_move_room"},
		"LEFT_ROOM": {"name": "actor_leave_room"},
		"BITCH_PLEASE": {"name": "bitch_please"},
		"BITCH_CHOOSE": {"name": "actor_bitch"}
	},
	GLOBAL_ROOMS_READY: {name: "rooms_ready"},
	"DEFAULT_ROOM": "IntroScene",
	"BITCH_INTERVAL": 5000
}
