import statsConfig from '../stats/stats.config';
import roomsConfig from '../rooms/rooms.config';
import mobsConfig from '../mobs/mobs.config';
import socketioConfig from '../socketio/socketio.config';
import combatConfig from '../combat/combat.config';
import questsConfig from '../quests/quests.config';

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
    GLOBAL_TALENT_READY: {name: "talent_ready"},
	GLOBAL_EVENTS: {
		CONFIG_READY: Object.assign({}, socketioConfig.GLOBAL_CONFIG_READY),
	},
	"SERVER_INNER": {
		GAIN_ABILITY: {name: "gain_ability", alive: true, log: true},
		HEAL_CHAR: Object.assign({}, combatConfig.SERVER_INNER.HEAL_CHAR),
		MOB_DESPAWN: Object.assign({}, mobsConfig.SERVER_INNER.MOB_DESPAWN),
		DMG_DEALT: Object.assign({}, combatConfig.SERVER_INNER.DMG_DEALT),		
		GAIN_CHAR_ABILITY_EXP: {name: "gain_char_ability_exp", alive: true, log: true},
		GAIN_PRIMARY_ABILITY_EXP: {name: "gain_primary_ability_exp", alive: true, log: true},
		GAIN_ABILITY_EXP: {name: "gain_ability_exp", alive: true},
		GAIN_ABILITY_LVL: {name: "gain_ability_lvl", alive: true, log: true},
		GENERATE_PERK_POOL: {name: "generate_perk_pool", alive: true},
		GAIN_LVL: Object.assign({}, statsConfig.SERVER_INNER.GAIN_LVL, {log: false}),
		LEFT_ROOM: Object.assign({}, roomsConfig.SERVER_INNER.LEFT_ROOM),
		QUEST_COMPLETED: Object.assign({}, questsConfig.SERVER_INNER.QUEST_COMPLETED),
	},
	"SERVER_GETS": {
		DISCONNECT: Object.assign({}, socketioConfig.SERVER_GETS.DISCONNECT),
		ENTERED_ROOM: Object.assign({}, roomsConfig.SERVER_GETS.ENTERED_ROOM, {log: false}),
		CHOOSE_ABILITY_PERK: {name: "choose_perk", alive: true, log: true},
	},
	"CLIENT_GETS": {
		GAIN_ABILITY_EXP: {name: "ability_gain_exp"},
		GAIN_ABILITY_LVL: {name: "ability_lvl_up"},
		CHOOSE_ABILITY_PERK: {name: "ability_choose_perk"},
		GAIN_ABILITY_PERK: {name: "ability_gain_perk"},
		ACTIVATED_BUFF: {name: "buff_activated"},
		RESISTED_BUFF: {name: "buff_resisted"},
		GAIN_ABILITY: {name: "actor_gain_ability"},
	},
	PERKS: {
		AOE_CHANCE: "aoeChance",
		AOE_CAP: "aoeCap",
		
		STUN_CHANCE: "stunChance",
		STUN_DURATION: "stunDuration",
		STUN_RESISTANCE: "stunResistance",
		
		CRIPPLE_CHANCE: "crippleChance",
		CRIPPLE_DURATION: "crippleDuration",
		CRIPPLE_RESISTANCE: "crippleResistance",
		
		BLEED_CHANCE: "bleedChance",
		BLEED_DURATION: "bleedDuration",
		BLEED_RESISTANCE: "bleedResistance",
		
		CHARGE_MODIFIER_KEY: "fullyChargeModifier",
        DMG_MODIFIER_KEY: "damageModifier",
        DMG_BONUS: "damageBonus",
        MIN_DMG_MODIFIER: "minDamageModifier",
		
		CRIT_CHANCE: "critChance",
		CRIT_MODIFIER_KEY: "critDamageModifier",
		
		BLOCK_CHANCE: "blockChance",
		DAMAGE_REDUCTION: "damageReduction",
		THREAT_MODIFIER_KEY: "threatModifier",
        DEFENCE_BONUS: "defenceBonus",
        SPIKES_MODIFIER: "spikesModifier",
        
		HP_BONUS: "hpBonus",
		HP_STEAL_CHANCE: "hpStealChance",
		HP_STEAL_MODIFIER: "hpStealModifier",
		HP_REGEN_MODIFIER: "hpRegenModifier",
		HP_REGEN_INTERVAL: "hpRegenInterval",
		
		MP_BONUS: "mpBonus",
		MP_STEAL_CHANCE: "mpStealChance",
		MP_STEAL_MODIFIER: "mpStealModifier",
		MP_REGEN_MODIFIER: "mpRegenModifier",
		MP_REGEN_INTERVAL: "mpRegenInterval",
		MP_COST: "mpCost",
		
		FREEZE_CHANCE: "freezeChance",
		FREEZE_DURATION: "freezeDuration",
		FREEZE_RESISTANCE: "freezeResistance",
		FROZEN_TARGET_MODIFIER_KEY: "frozenTargetModifier",
		
		BURN_CHANCE: "burnChance",
		BURN_DURATION: "burnDuration",
		BURN_RESISTANCE: "burnResistance",
		BURNT_TARGET_MODIFIER_KEY: "burntTargetModifier",

		QUEST_EXP_BONUS: "questExpBonus",
		QUEST_GOLD_BONUS: "questGoldBonus",
    },
    PERKS_INFO: {
        BLEED_DMG_MODIFIER: 0.1,
        BLEED_TICK_TIME: 0.5,
        ABILITY_DMG_BONUS_SUFFIX: "DamageBonus",
        BURN_DMG_MODIFIER: 0.05,
        BURN_TICK_TIME: 0.25,
	},
	PERK_TYPES: {
		PERCENT: "Percent",
		NUMBER: "Number",
		TIME: "Time",
	},
	HIT_TYPE_ATTACK: "atk",
	HIT_TYPE_HEAL: "heal",
    CHAR_TALENT: "charTalent",
    CHAR_QUESTS_TALENT: "quests",
}