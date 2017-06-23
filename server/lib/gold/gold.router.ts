'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import ItemsRouter from '../items/items.router';
import GoldMiddleware from './gold.middleware';
import PartyRouter from '../party/party.router';

let dropsConfig = require('../../../server/lib/drops/drops.config.json');
let config = require('../../../server/lib/gold/gold.config.json');

export default class GoldRouter extends SocketioRouterBase {
	protected middleware: GoldMiddleware;
    protected itemsRouter: ItemsRouter;
    protected partyRouter: PartyRouter;

	init(files, app) {
		super.init(files, app);
		this.itemsRouter = files.routers.items;
        this.partyRouter = files.routers.party;
	}

	[config.SERVER_GETS.ITEM_PICK.name](data, socket: GameSocket) {
		this.emitter.emit(dropsConfig.SERVER_INNER.ITEM_PICK.name, data, socket, (item: ITEM_INSTANCE): any => {
            let itemInfo = this.itemsRouter.getItemInfo(item.key);
            if (!this.middleware.isGold(itemInfo)) {
                return;
            }
            let partySockets = this.partyRouter.getPartyMembersInMap(socket);
            // divide the gold equally among party members in room
            item.stack = Math.ceil(item.stack / partySockets.length);
            for (let memberSocket of partySockets) {
                this[config.SERVER_INNER.ITEM_ADD.name]({item}, memberSocket);
            }
            return true;
		});
	}

	[config.SERVER_INNER.ITEM_ADD.name](data: {item: ITEM_INSTANCE}, socket: GameSocket) {
        let {item} = data;

        if (this.middleware.isGold(item)) {
            socket.character.gold += +item.stack;
            socket.emit(this.CLIENT_GETS.CHANGE_GOLD.name, {
                amount: item.stack
            });
            this.log(data, socket, "Gaining item");
        }
	}

	[config.SERVER_INNER.ITEM_REMOVE.name](data: {item: ITEM_INSTANCE}, socket: GameSocket) {
		let {stack, key} = data.item;
		if (this.middleware.isGold({key})) {
            socket.character.gold -= stack;
            socket.emit(this.CLIENT_GETS.CHANGE_GOLD.name, {
                amount: -stack
            });
            this.log(data, socket, "Remove item");
		}
	}

	[config.SERVER_GETS.DROP_GOLD.name](data, socket: GameSocket) {
        let {amount} = data;
        if (!(amount > 0)) {
            this.sendError(data, socket, "Must mention what gold amount to throw");
        } else if (socket.character.gold === 0) {
            this.sendError(data, socket, "Character does not have gold to throw!");
        } else {
			let item = this.itemsRouter.getItemInstance("gold");
            item.stack = Math.min(amount, socket.character.gold);
            this.emitter.emit(config.SERVER_INNER.ITEM_REMOVE.name, {item}, socket);
            this.emitter.emit(dropsConfig.SERVER_INNER.ITEMS_DROP.name, {}, socket, [item]);
        }
	}
};
