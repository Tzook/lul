export default {
	"SERVER_INNER": {
		"GAIN_EXP": {"name": "gain_exp", "alive": true, "log": true},
		"GAIN_LVL": {"name": "gain_lvl", "alive": true, "log": true},
		"GAIN_HP": {"name": "gain_hp", "alive": true, "log": true},
		"GAIN_MP": {"name": "gain_mp", "alive": true, "log": true},
		"GAIN_STATS": {"name": "gain_stats", "alive": true, "log": true},
		"TAKE_DMG": {"name": "take_dmg", "alive": true},
		"USE_MP": {"name": "use_mp", "alive": true, "log": true},
		"STATS_ADD": {"name": "stats_add", "alive": true},
		"UPDATE_MAX_STATS": {"name": "update_max_stats"},
	},
	"SERVER_GETS": {
		"TAKE_WORLD_DAMAGE": {"name": "take_world_damage", "alive": true, "log": true},
		"RELEASE_DEATH": {"name": "release_death", "alive": false, "log": true}
	},
	"CLIENT_GETS": {
		"GAIN_EXP": {"name": "actor_gain_exp"},
		"GAIN_HP": {"name": "actor_gain_hp"},
		"GAIN_MP": {"name": "actor_gain_mp"},
		"GAIN_STATS": {"name": "actor_gain_stats"},
		"USE_MP": {"name": "actor_use_mp"},
		"DEATH": {"name": "actor_ded"},
		"RESURRECT": {"name": "actor_resurrect"},
		"LEVEL_UP": {"name": "actor_lvl_up"}
	},
	REGEN_CAUSE: {
		HEAL: "heal",
		AOE: "aoe",
		STEAL: "steal",
		USE: "use",
		REGEN: "regen",
		OTHER: "other",
	},
	"ABILITY_MELEE": "melee",
};