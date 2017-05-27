'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import ItemsRouter from '../items/items.router';
import GoldMiddleware from './gold.middleware';

let dropsConfig = require('../../../server/lib/drops/drops.config.json');
let config = require('../../../server/lib/gold/gold.config.json');

export default class GoldRouter extends SocketioRouterBase {
	protected middleware: GoldMiddleware;
    protected itemsRouter: ItemsRouter;

	init(files, app) {
		super.init(files, app);
		this.itemsRouter = files.routers.items;
	}

	[config.SERVER_GETS.ITEM_PICK.name](data, socket: GameSocket) {
		this.emitter.emit(dropsConfig.SERVER_INNER.ITEM_PICK.name, data, socket, (item: ITEM_INSTANCE): any => {
            let itemInfo = this.itemsRouter.getItemInfo(item.key);
            if (!this.middleware.isGold(itemInfo)) {
                return;
            }
            this[config.SERVER_INNER.ITEM_ADD.name]({item}, socket);
            return true;
		});
	}

	[config.SERVER_INNER.ITEM_ADD.name](data: {item: ITEM_INSTANCE}, socket: GameSocket) {
        let {item} = data;

        if (this.middleware.isGold(item)) {
            socket.character.gold += item.stack;
            socket.emit(this.CLIENT_GETS.CHANGE_GOLD.name, {
                amount: item.stack
            });
            console.log("Gaining gold", item.stack, socket.character.name);
        }
	}

	[config.SERVER_INNER.ITEM_REMOVE.name](data: {stack: number, itemId: string}, socket: GameSocket) {
		let {stack, itemId} = data;
		if (this.middleware.isGold({key: itemId})) {
			this.loseGold(socket, stack);
		}
	}

	[config.SERVER_GETS.DROP_GOLD.name](data, socket: GameSocket) {
        let {amount} = data;
        if (!(amount > 0)) {
            this.sendError(data, socket, "Must mention what gold amount to throw");
        } else if (socket.character.gold === 0) {
            this.sendError(data, socket, "Character does not have gold to throw!");
        } else {
            let amountToDrop = Math.min(amount, socket.character.gold);
			this.loseGold(socket, amountToDrop);
            let item = this.itemsRouter.getItemInstance("gold");
            item.stack = amountToDrop;
            console.log("dropping gold", item);
            this.emitter.emit(dropsConfig.SERVER_INNER.ITEMS_DROP.name, {}, socket, [item]);
        }
	}

    private loseGold(socket: GameSocket, amount) {
        socket.character.gold -= amount;
        socket.emit(this.CLIENT_GETS.CHANGE_GOLD.name, {
            amount: -amount
        });
    }
};
