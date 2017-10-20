const CONFIG = {
	"SERVER_INNER": {
		"GAIN_EXP": {"name": "gain_exp", "alive": true, "log": true},
		"GAIN_LVL": {"name": "gain_lvl", "alive": true, "log": true},
		"GAIN_HP": {"name": "gain_hp", "alive": true, "log": true},
		"GAIN_MP": {"name": "gain_mp", "alive": true, "log": true},
		"GAIN_STATS": {"name": "gain_stats", "alive": true, "log": true},
		"GAIN_CLASS": {"name": "gain_class", "alive": true, "log": true},
		"GAIN_ABILITY": {"name": "gain_ability", "alive": true, "log": true},
		"TAKE_DMG": {"name": "take_dmg", "alive": true, "log": true},
		"STATS_ADD": {"name": "stats_add", "alive": true},
		"STATS_REMOVE": {"name": "stats_remove", "alive": true}
	},
	"SERVER_GETS": {
		"RELEASE_DEATH": {"name": "release_death", "alive": false, "log": true}
	},
	"CLIENT_GETS": {
		"GAIN_EXP": {"name": "actor_gain_exp"},
		"GAIN_HP": {"name": "actor_gain_hp"},
		"GAIN_MP": {"name": "actor_gain_mp"},
		"GAIN_STATS": {"name": "actor_gain_stats"},
		"GAIN_CLASS": {"name": "actor_gain_class"},
		"GAIN_ABILITY": {"name": "actor_gain_ability"},
		"TAKE_DMG": {"name": "actor_take_dmg"},
		"DEATH": {"name": "actor_ded"},
		"RESURRECT": {"name": "actor_resurrect"},
		"LEVEL_UP": {"name": "actor_lvl_up"}
	},
	"BEGIN_STATS_SUM": 7,
	"BEGIN_HP_REGEN": 5,
	"BEGIN_MP_REGEN": 10,
	"REGEN_INTERVAL": 5000,
	"ABILITY_MELEE": "melee",
	ABILITY_RANGE: "range",
	CLASS_ADVENTURER: "adv",
	CLASS_WARRIOR: "war",
	CLASS_MAGICION: "mag",
	CLASS_ARCHER: "arc",
	"MAG_TO_MP_RATIO": 6,
	"STR_TO_HP_RATIO": 5,
	"LEVEL_UP_STAT_BONUS": 1
}

export default CONFIG;