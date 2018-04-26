import itemsConfig from "../items/items.config";
import roomsConfig from "../rooms/rooms.config";
import mobsConfig from "../mobs/mobs.config";

export default {
	GLOBAL_EVENTS: {
		GLOBAL_ITEMS_READY: Object.assign({}, itemsConfig.GLOBAL_ITEMS_READY),
		GLOBAL_ROOMS_READY: Object.assign({}, roomsConfig.GLOBAL_ROOMS_READY),
		GLOBAL_MOBS_READY: Object.assign({}, mobsConfig.GLOBAL_EVENTS.GLOBAL_MOBS_READY),
	},
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
            param: "{perk1|perk2|*?} {lvl?}"
		},
		LVLPA: {
			code: "/lvlpa",
			param: "{perk1|perk2|*?} {lvl?} {ability?}"
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
		SPAWN: {
			code: "/spawn",
			param: "{mob}"
		},
	}
}