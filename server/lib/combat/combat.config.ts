export default {
	SERVER_INNER: {
		"HEAL_CHARS": {"name": "heal_chars", "alive": true, "log": true},
		"HEAL_CHAR": {"name": "heal_char", "alive": true},
	},
	"SERVER_GETS": {
		"LOAD_ATTACK": {"name": "loaded_attack", "alive": true, "log": true},
		"PERFORM_ATTACK": {"name": "performed_attack", "alive": true, "log": true},
		"CHANGE_ABILITY": {"name": "changed_ability", "alive": true, "log": true},
		"USE_ABILITY": {"name": "used_ability", "alive": true, "log": true},
	},
	"CLIENT_GETS": {
		"LOAD_ATTACK": {"name": "actor_load_attack"},
		"PERFORM_ATTACK": {"name": "actor_perform_attack"},
		"CHANGE_ABILITY": {"name": "actor_change_ability"}
	},
	HIT_CAUSE: {
		ATK: "attack",
		HEAL: "heal",
		AOE: "aoe",
		BLEED: "bleed",
	}
}