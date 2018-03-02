import statsConfig from '../stats/stats.config';
import roomsConfig from '../rooms/rooms.config';
import mobsConfig from '../mobs/mobs.config';
import socketioConfig from '../socketio/socketio.config';
import combatConfig from '../combat/combat.config';

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
		HEAL_CHAR: Object.assign({}, combatConfig.SERVER_INNER.HEAL_CHAR),
		MOB_AGGRO_CHANGED: Object.assign({}, mobsConfig.SERVER_INNER.MOB_AGGRO_CHANGED),
		MOB_DESPAWN: Object.assign({}, mobsConfig.SERVER_INNER.MOB_DESPAWN),
		TOOK_DMG: Object.assign({}, statsConfig.SERVER_INNER.TOOK_DMG),		
		GAIN_ABILITY_EXP: {name: "gain_ability_exp", alive: true, log: true},
		GAIN_ABILITY_LVL: {name: "gain_ability_lvl", alive: true, log: true},
		GENERATE_PERK_POOL: {name: "generate_perk_pool", alive: true},
		GAIN_LVL: Object.assign({}, statsConfig.SERVER_INNER.GAIN_LVL, {log: false}),
		CHANGED_ABILITY: Object.assign({}, combatConfig.SERVER_INNER.CHANGED_ABILITY),
	},
	"SERVER_GETS": {
		DISCONNECT: Object.assign({}, socketioConfig.SERVER_GETS.DISCONNECT),
		ENTERED_ROOM: Object.assign({}, roomsConfig.SERVER_GETS.ENTERED_ROOM, {log: false}),
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
		BLEED_TICK_TIME: 0.5,
		
		CHARGE_MODIFIER_KEY: "fullyChargeModifier",
		DMG_MODIFIER_KEY: "damageModifier",
		
		CRIT_CHANCE: "critChance",
		CRIT_MODIFIER_KEY: "critDamageModifier",
		
		BLOCK_CHANCE: "blockChance",
		DAMAGE_REDUCTION: "damageReduction",
		THREAT_MODIFIER_KEY: "threatModifier",

		LIFE_STEAL_KEY: "lifeSteal",
		MANA_STEAL_KEY: "manaSteal",
		HP_REGEN_MODIFIER: "hpRegenModifier",
		MP_REGEN_MODIFIER: "mpRegenModifier",
		HP_REGEN_INTERVAL: "hpRegenInterval",
		MP_REGEN_INTERVAL: "mpRegenInterval",
		HP_BONUS: "hpBonus",
		MP_BONUS: "mpBonus",
		
		FREEZE_CHANCE: "freezeChance",
		FREEZE_DURATION: "freezeDuration",
		FROZEN_TARGET_MODIFIER_KEY: "frozenTargetModifier",
		
		BURN_CHANCE: "burnChance",
		BURN_DURATION: "burnDuration",
		BURNT_TARGET_MODIFIER_KEY: "burntTargetModifier",
		BURN_DMG_MODIFIER: 0.05,
		BURN_TICK_TIME: 0.25,
	},
	HIT_TYPE_ATTACK: "atk",
	HIT_TYPE_HEAL: "heal",
	CHAR_TALENT: "charTalent"
}





