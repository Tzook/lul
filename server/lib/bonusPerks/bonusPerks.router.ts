import bonusPerksConfig from "./bonusPerks.config";
import { createBonusPerks, updateBonusPerks, getEmptyBonusPerks, getBonusPerks, modifyBonusPerks, addBonusPerks, removeBonusPerks, setClientPerks, notifyBonusPerks } from "./bonusPerks.services";
import SocketioRouterBase from "../socketio/socketio.router.base";

export default class BonusPerksRouter extends SocketioRouterBase {
    public onConnected(socket: GameSocket) {
        createBonusPerks(socket, socket.character);
        process.nextTick(() => updateBonusPerks(socket, getEmptyBonusPerks(), getBonusPerks(socket)));
	}	
	
    [bonusPerksConfig.GLOBAL_EVENTS.CONFIG_READY.name]() {
		setClientPerks();
    }
	
	[bonusPerksConfig.SERVER_GETS.ENTERED_ROOM.name](data, socket: GameSocket) {
        notifyBonusPerks(socket, getBonusPerks(socket));
    }
	
	[bonusPerksConfig.SERVER_INNER.CHANGED_ABILITY.name](data, socket: GameSocket) {
		let {previousAbility} = data;

		const oldStats = getBonusPerks(socket, previousAbility);
		const newStats = getBonusPerks(socket);
		updateBonusPerks(socket, oldStats, newStats);
    }
    
    [bonusPerksConfig.SERVER_INNER.UPDATE_MAX_STATS.name](data: {hp, mp}, socket: GameSocket) {
        let diff: PERKS_DIFF = {
            hpBonus: data.hp,
            mpBonus: data.mp
        };
        notifyBonusPerks(socket, diff);
    }

    [bonusPerksConfig.SERVER_INNER.WORE_EQUIP.name](data: {equip: ITEM_INSTANCE, oldEquip: ITEM_INSTANCE}, socket: GameSocket) {
        const {equip, oldEquip} = data;
        modifyBonusPerks(socket, () => {
            addBonusPerks(equip, socket);
            removeBonusPerks(oldEquip, socket);
        });
    }
}