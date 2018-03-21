import combatConfig from "../combat/combat.config";
import equipsConfig from "../equips/equips.config";

export default {
    SERVER_INNER: {
		CHANGED_ABILITY: Object.assign({}, combatConfig.SERVER_INNER.CHANGED_ABILITY),
		WORE_EQUIP: Object.assign({}, equipsConfig.SERVER_INNER.WORE_EQUIP),
    },
    CLIENT_GETS: {
		UPDATE_ATTACK_SPEED: {name: "update_actor_attack_speed"},
		UPDATE_MANA_COST: {name: "update_actor_mana_cost"},
    },
    PERK_VALUES_RANDOM_OFFSET: 0.2,    
};