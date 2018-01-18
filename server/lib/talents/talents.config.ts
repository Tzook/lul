import statsConfig from '../stats/stats.config';
import roomsConfig from '../rooms/rooms.config';
import mobsConfig from '../mobs/mobs.config';
import socketioConfig from '../socketio/socketio.config';

export default {
	"ROUTES": {
		"GENERATE": "/talents/generate"
	},
	"LOGS": {
		"GENERATE_TALENTS": {
			"MSG": "Generated talents successfully.",
			"CODE": "TALENTS_1",
			"STATUS": "OK"
		}
	},
	"SERVER_INNER": {
		GAIN_ABILITY: {name: "gain_ability", alive: true, log: true},
		HURT_MOB: Object.assign({}, mobsConfig.SERVER_INNER.HURT_MOB),
		MOB_AGGRO_CHANGED: Object.assign({}, mobsConfig.SERVER_INNER.MOB_AGGRO_CHANGED),
		MOB_DESPAWN: Object.assign({}, mobsConfig.SERVER_INNER.MOB_DESPAWN),
		TOOK_DMG: Object.assign({}, statsConfig.SERVER_INNER.TOOK_DMG),		
		GAIN_ABILITY_EXP: {name: "gain_ability_exp", alive: true, log: true},
		GAIN_ABILITY_LVL: {name: "gain_ability_lvl", alive: true, log: true},
		GENERATE_PERK_POOL: {name: "generate_perk_pool", alive: true},
	},
	"SERVER_GETS": {
		DISCONNECT: Object.assign({}, socketioConfig.SERVER_GETS.DISCONNECT),
		ENTERED_ROOM: Object.assign({}, roomsConfig.SERVER_GETS.ENTERED_ROOM),
		CHOOSE_ABILITY_PERK: {name: "choose_perk", alive: true, log: true},
		USE_SPELL: {name: "used_spell", alive: true, log: true},
		HIT_SPELL: {name: "hit_spell", alive: true, log: true},
		HURT_BY_SPELL: {name: "took_spell_dmg", log: true},
	},
	"CLIENT_GETS": {
		GAIN_ABILITY_EXP: {name: "ability_gain_exp"},
		GAIN_ABILITY_LVL: {name: "ability_lvl_up"},
		CHOOSE_ABILITY_PERK: {name: "ability_choose_perk"},
		GAIN_ABILITY_PERK: {name: "ability_gain_perk"},
		ACTIVATED_BUFF: {name: "buff_activated"},
		USE_SPELL: {name: "spell_activated"},
		MOB_USE_SPELL: {name: "mob_spell_activated"},
		GAIN_ABILITY: {name: "actor_gain_ability"},
	},
	PERKS: {
		AOE_CHANCE: "aoeChance",
		AOE_CAP: "aoeCap",
		STUN_CHANCE: "stunChance",
		STUN_DURATION: "stunDuration",
		CRIPPLE_CHANCE: "crippleChance",
		CRIPPLE_DURATION: "crippleDuration",
		BLEED_CHANCE: "bleedChance",
		BLEED_DURATION: "bleedDuration",
		BLEED_DMG_MODIFIER: 0.1,
		BLEED_TICK_TIME: 1,
		BLEED_DMG_CAUSE: "bleed",
		CHARGE_MODIFIER_KEY: "fullyChargeModifier",
		LIFE_STEAL_KEY: "lifeSteal",
		MANA_STEAL_KEY: "manaSteal",
		DMG_MODIFIER_KEY: "damageModifier",
		CRIT_CHANCE: "critChance",
		CRIT_MODIFIER_KEY: "critDamageModifier",
		THREAT_MODIFIER_KEY: "threatModifier",
		BLOCK_CHANCE: "blockChance",
		DAMAGE_REDUCTION: "damageReduction",
	},
	HIT_TYPE_ATTACK: "atk",
	HIT_TYPE_HEAL: "heal",
}