import itemsConfig from "../items/items.config";
import combatConfig from "../combat/combat.config";

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
	GLOBAL_EVENTS: {
		GLOBAL_ITEMS_READY: Object.assign({}, itemsConfig.GLOBAL_ITEMS_READY),
		GLOBAL_MOBS_READY: {"name": "mobs_ready"},
	},
    "SERVER_INNER": {
        TARGET_BLOCKS: Object.assign({}, combatConfig.SERVER_INNER.TARGET_BLOCKS),		
        HURT_TARGET: Object.assign({}, combatConfig.SERVER_INNER.HURT_TARGET),		
        DMG_DEALT: Object.assign({}, combatConfig.SERVER_INNER.DMG_DEALT),		
        "LEFT_ROOM": {"name": "left_room"},
        "MISS_MOB": {"name": "miss_mob"},
		"MOB_DESPAWN": {"name": "mob_despawn"},
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
		"MOB_TAKE_MISS": {"name": "mob_take_miss"},
		"MOB_MOVE": {"name": "mob_move"},
		"AGGRO": {"name": "aggro"},
		"MOB_ATTACK_BLOCK": {"name": "mob_blocked"},
    },
	MISS_CHANCE_PER_LVL: 10,
    MOB_DEATH_DEBOUNCE: 5000,
    SPAWN_INTERVAL_OFFSET: 1000,
}