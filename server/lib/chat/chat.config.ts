export default {
	"SERVER_GETS": {
		"SHOUT": {"name": "shouted", "log": true},
		"CHAT": {"name": "chatted", "log": true},
		"WHISPER": {"name": "whispered", "log": true},
		"PARTY_CHAT": {"name": "party_chatted", "log": true}
	},
	"CLIENT_GETS": {
		"SHOUT": {"name": "shout"},
		"CHAT": {"name": "chat"},
		"WHISPER": {"name": "whisper"},
		"PARTY_CHAT": {"name": "party_chat"}
	},
	HAX: {
		HELP: {
			code: "/help",
		},
		LVL: {
			code: "/lvl",
            param: "{auto?}"
		},
		LVLPA: {
			code: "/lvlpa",
			param: "{auto?}"
		},
		GAINPA: {
			code: "/gainpa",
			param: "{ability}"
		},
		TP: {
			code: "/tp",
			param: "{scene}"
		},
		GOLD: {
			code: "/gold",
			param: "{amount?}"
		},
		DROP: {
			code: "/drop",
			param: "{item} {stack?}"
		},
	}
}