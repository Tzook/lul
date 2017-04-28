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

	[SERVER_GETS.ITEM_PICK](data, socket: GameSocket) {
		this.emitter.emit(dropsConfig.SERVER_INNER.ITEM_PICK, data, socket, (item: ITEM_INSTANCE): any => {
            let itemInfo = this.itemsRouter.getItemInfo(item.key);
            if (itemInfo.key !== "gold") {
                return;
            }
            socket.character.gold += item.stack;
            socket.emit(this.CLIENT_GETS.GAIN_GOLD, {
                amount: item.stack
            });
            console.log("Gaining gold for %s. picked %d, now has: %d", socket.character.name, item.stack, socket.character.gold);
            return true;
		});
	}
};
