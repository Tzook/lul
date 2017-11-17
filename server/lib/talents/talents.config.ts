import statsConfig from '../stats/stats.config';
import roomsConfig from '../rooms/rooms.config';
import mobsConfig from '../mobs/mobs.config';

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
		GAIN_ABILITY: Object.assign({}, statsConfig.SERVER_INNER.GAIN_ABILITY),
		HURT_MOB: Object.assign({}, mobsConfig.SERVER_INNER.HURT_MOB),
		GAIN_ABILITY_EXP: {name: "gain_ability_exp", alive: true, log: true},
		GAIN_ABILITY_LVL: {name: "gain_ability_lvl", alive: true, log: true},
		GENERATE_PERK_POOL: {name: "generate_perk_pool", alive: true},
	},
	"SERVER_GETS": {
		ENTERED_ROOM: Object.assign({}, roomsConfig.SERVER_GETS.ENTERED_ROOM),
		CHOOSE_ABILITY_PERK: {name: "choose_perk", alive: true, log: true},
	},
	"CLIENT_GETS": {
		GAIN_ABILITY_EXP: {name: "ability_gain_exp"},
		GAIN_ABILITY_LVL: {name: "ability_lvl_up"},
		CHOOSE_ABILITY_PERK: {name: "ability_choose_perk"},
		GAIN_ABILITY_PERK: {name: "ability_gain_perk"},
		ACTIVATED_BUFF: {name: "buff_activated"},
		ACTIVATED_PERK: {name: "perk_activated"},
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
	}
}