'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import ItemsRouter from '../items/items.router';

let dropsConfig = require('../../../server/lib/drops/drops.config.json');
let SERVER_GETS = require('../../../server/lib/gold/gold.config.json').SERVER_GETS;

export default class GoldRouter extends SocketioRouterBase {
	protected itemsRouter: ItemsRouter;

	init(files, app) {
		super.init(files, app);
		this.itemsRouter = files.routers.items;
	}

	[SERVER_GETS.ITEM_PICK.name](data, socket: GameSocket) {
		this.emitter.emit(dropsConfig.SERVER_INNER.ITEM_PICK.name, data, socket, (item: ITEM_INSTANCE): any => {
            let itemInfo = this.itemsRouter.getItemInfo(item.key);
            if (itemInfo.key !== "gold") {
                return;
            }
            socket.character.gold += item.stack;
            socket.emit(this.CLIENT_GETS.CHANGE_GOLD.name, {
                amount: item.stack
            });
            console.log("Gaining gold for %s. picked %d, now has: %d", socket.character.name, item.stack, socket.character.gold);
            return true;
		});
	}

	[SERVER_GETS.DROP_GOLD.name](data, socket: GameSocket) {
        let {amount} = data;
        if (!(amount > 0)) {
            this.sendError(data, socket, "Must mention what gold amount to throw");
        } else {
            let amountToDrop = Math.min(amount, socket.character.gold);
            socket.character.gold -= amountToDrop;
            socket.emit(this.CLIENT_GETS.CHANGE_GOLD.name, {
                amount: -amountToDrop
            });
            let item = this.itemsRouter.getItemInstance("gold");
            item.stack = amountToDrop;
            console.log("dropping gold", item);
            this.emitter.emit(dropsConfig.SERVER_INNER.ITEMS_DROP.name, {}, socket, [item]);
        }
	}
};
