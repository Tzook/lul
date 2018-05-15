import mobsConfig from "../mobs/mobs.config";
import talentsConfig from "../talents/talents.config";
import roomsConfig from "../rooms/rooms.config";

export default {
	GLOBAL_EVENTS: {
		GLOBAL_TALENT_READY: Object.assign({}, talentsConfig.GLOBAL_TALENT_READY),
	},
    SERVER_INNER: {
		GAIN_PRIMARY_ABILITY_EXP: Object.assign({}, talentsConfig.SERVER_INNER.GAIN_PRIMARY_ABILITY_EXP, {log: false}),
		MOB_AGGRO_CHANGED: Object.assign({}, mobsConfig.SERVER_INNER.MOB_AGGRO_CHANGED),
		MOB_DESPAWN: Object.assign({}, mobsConfig.SERVER_INNER.MOB_DESPAWN),
	},
	SERVER_GETS: {
        ENTERED_ROOM: Object.assign({}, roomsConfig.SERVER_GETS.ENTERED_ROOM, {log: false}),
		USE_SPELL: {name: "used_spell", alive: true, log: true},
		HIT_SPELL: {name: "hit_spell", alive: true, log: true},
		HURT_BY_SPELL: {name: "took_spell_dmg", alive: true, log: true},
	},
	CLIENT_GETS: {
		USE_SPELL: {name: "spell_activated"},
		SPELL_COOLDOWN: {name: "spell_cooldown"},
		MOB_USE_SPELL: {name: "mob_spell_activated"},
		GAIN_SPELL_EXP: {name: "gain_spell_exp"},
		GAIN_SPELL_LVL: {name: "gain_spell_lvl"},
    },
	SKIP_SPELL_RETRY_TIME: 2000,  
	PERK_LEVEL_BONUS_OFFSET: 0.02,
}