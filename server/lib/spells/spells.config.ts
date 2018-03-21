import mobsConfig from "../mobs/mobs.config";
import talentsConfig from "../talents/talents.config";

export default {
	GLOBAL_EVENTS: {
		GLOBAL_TALENT_READY: Object.assign({}, talentsConfig.GLOBAL_TALENT_READY),
	},
    SERVER_INNER: {
		MOB_AGGRO_CHANGED: Object.assign({}, mobsConfig.SERVER_INNER.MOB_AGGRO_CHANGED),
		MOB_DESPAWN: Object.assign({}, mobsConfig.SERVER_INNER.MOB_DESPAWN),
    },
	SERVER_GETS: {
		USE_SPELL: {name: "used_spell", alive: true, log: true},
		HIT_SPELL: {name: "hit_spell", alive: true, log: true},
		HURT_BY_SPELL: {name: "took_spell_dmg", alive: true, log: true},
	},
	CLIENT_GETS: {
		USE_SPELL: {name: "spell_activated"},
		MOB_USE_SPELL: {name: "mob_spell_activated"},
    },
    SKIP_SPELL_RETRY_TIME: 3000,    
}