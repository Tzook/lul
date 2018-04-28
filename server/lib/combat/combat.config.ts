export default {
	SERVER_INNER: {
		"HEAL_CHARS": {"name": "heal_chars", "alive": true, "log": true},
		"HEAL_CHAR": {"name": "heal_char", "alive": true},
		"CHANGED_ABILITY": {"name": "changed_ability_inner"},
		"ACTIVATE_ABILITY": {"name": "activated_ability"},
		DMG_DEALT: {name: "dmg_dealt"},
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
		"CHANGE_ABILITY": {"name": "actor_change_ability"},
		DMG_DEALT: {"name": "take_damage"},
	},
	HIT_CAUSE: {
		ATK: "attack",
		SPELL: "spell",
		HEAL: "heal",
		AOE: "aoe",
		BLEED: "bleed",
		SPIKES: "spikes",
		BURN: "burn",
	},
	ATTACK_INFO_ALIVE_TIME: 5000,
}