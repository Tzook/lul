import combatConfig from "../combat/combat.config";
import equipsConfig from "../equips/equips.config";
import statsConfig from "../stats/stats.config";
import socketioConfig from "../socketio/socketio.config";

export default {
	GLOBAL_EVENTS: {
		CONFIG_READY: Object.assign({}, socketioConfig.GLOBAL_CONFIG_READY),
	},
    SERVER_INNER: {
        CHANGED_ABILITY: Object.assign({}, combatConfig.SERVER_INNER.CHANGED_ABILITY),
        UPDATE_MAX_STATS: Object.assign({}, statsConfig.SERVER_INNER.UPDATE_MAX_STATS),
        WORE_EQUIP: Object.assign({}, equipsConfig.SERVER_INNER.WORE_EQUIP),
    },
    CLIENT_GETS: {
		UPDATE_CLIENT_PERKS: {name: "update_client_perks"},
    },
    PERK_VALUES_RANDOM_OFFSET: 0.2,    
};