import bonusPerksConfig from "./bonusPerks.config";
import { createBonusPerks, updateBonusPerks, getEmptyBonusPerks, getBonusPerks, modifyBonusPerks, addBonusPerks, removeBonusPerks } from "./bonusPerks.services";
import SocketioRouterBase from "../socketio/socketio.router.base";

export default class BonusPerksRouter extends SocketioRouterBase {
    public onConnected(socket: GameSocket) {
        createBonusPerks(socket);
        process.nextTick(() => updateBonusPerks(socket, getEmptyBonusPerks(), getBonusPerks(socket)));
	}
	
	[bonusPerksConfig.SERVER_INNER.CHANGED_ABILITY.name](data, socket: GameSocket) {
		let {previousAbility} = data;

		const oldStats = getBonusPerks(socket, previousAbility);
		const newStats = getBonusPerks(socket);
		updateBonusPerks(socket, oldStats, newStats);
    }

    [bonusPerksConfig.SERVER_INNER.WORE_EQUIP.name](data: {equip: ITEM_INSTANCE, oldEquip: ITEM_INSTANCE}, socket: GameSocket) {
        const {equip, oldEquip} = data;
        modifyBonusPerks(socket, () => {
            addBonusPerks(equip, socket);
            removeBonusPerks(oldEquip, socket);
        });
    }
}