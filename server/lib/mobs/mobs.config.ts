export default {
	"ROUTES": {
		"GENERATE": "/mob/generate"
	},
	"LOGS": {
		"GENERATE_MOB": {
			"MSG": "Generated mob successfully.",
			"CODE": "MOB_1",
			"STATUS": "OK"
		}
	},
    "SERVER_INNER": {
        "LEFT_ROOM": {"name": "left_room"},
        "HURT_MOB": {"name": "hurt_mob"}
    },
	"SERVER_GETS": {
		"ENTERED_ROOM": {"name": "entered_room"},
		"MOB_TAKE_DMG": {"name": "mob_took_dmg", "alive": true},
		"MOBS_MOVE": {"name": "mobs_moved", "throttle": 0, "bitch": true},
		"TAKE_DMG": {"name": "took_dmg", "alive": true}
	},
	"CLIENT_GETS": {
		"MOB_SPAWN": {"name": "mob_spawn"},
		"MOB_DIE": {"name": "mob_die"},
		"MOB_TAKE_DMG": {"name": "mob_take_dmg"},
		"MOB_MOVE": {"name": "mob_move"},
		"AGGRO": {"name": "aggro"}
	},
    "MEELE_THREAT": 1.2
}