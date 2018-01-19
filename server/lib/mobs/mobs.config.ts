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
		"MOB_TAKE_DMG": {"name": "mob_took_dmg"},
        "HURT_MOB": {"name": "hurt_mob"},
        "MISS_MOB": {"name": "miss_mob"},
		"MOB_DESPAWN": {"name": "mob_despawn"},
		"MOBS_TAKE_DMG": {"name": "mobs_took_dmg", "alive": true, log: true},
		"MOB_AGGRO_CHANGED": {"name": "mob_aggro_changed"},
    },
	"SERVER_GETS": {
		"ENTERED_ROOM": {"name": "entered_room"},
		"MOBS_MOVE": {"name": "mobs_moved", "throttle": 0, "bitch": true},
		"PLAYER_TAKE_DMG": {"name": "took_dmg", "alive": true, log: true}
	},
	"CLIENT_GETS": {
		"MOB_SPAWN": {"name": "mob_spawn"},
		"MOB_DIE": {"name": "mob_die"},
		"MOB_TAKE_DMG": {"name": "mob_take_dmg"},
		"MOB_TAKE_MISS": {"name": "mob_take_miss"},
		"MOB_MOVE": {"name": "mob_move"},
		"AGGRO": {"name": "aggro"},
		"ATTACK_BLOCK": {"name": "actor_blocked"},
		"MOB_ATTACK_BLOCK": {"name": "mob_blocked"},
	},
	MISS_CHANCE_PER_LVL: 20,
	MISS_CHANCE_LVLS: 5,
}