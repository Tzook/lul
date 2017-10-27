import SocketioRouterBase from '../socketio/socketio.router.base';
import NpcsServices from "./npcs.services";
import npcsConfig from "../npcs/npcs.config";
import ItemsRouter from '../items/items.router';
import itemsConfig from '../items/items.config';
import GoldRouter from '../gold/gold.router';

export default class NpcsRouter extends SocketioRouterBase {
    protected services: NpcsServices;
    protected itemsRouter: ItemsRouter;
    protected goldRouter: GoldRouter;

	init(files, app) {
        this.services = files.services;
        this.itemsRouter = files.routers.items;
        this.goldRouter = files.routers.gold;
		super.init(files, app);
	}

    public updateNpcs(room: string, npcs: any[]): Promise<any> {
        return this.services.updateNpcs(room, npcs);
    }

    public doesNpcGiveQuest(npcKey: string, questKey: string): boolean {
        return this.services.doesNpcGiveQuest(npcKey, questKey);
    }

    public doesNpcEndQuest(npcKey: string, questKey: string): boolean {
        return this.services.doesNpcEndQuest(npcKey, questKey);
    }

    public isNpcInRoom(npcKey: string, room: string): boolean {
        return this.services.isNpcInRoom(npcKey, room);
    } 

	[npcsConfig.SERVER_GETS.ITEM_BUY.name](data, socket: GameSocket) {
        let {npcKey, index, stack} = data;
        stack = Math.abs(stack || 1);
        let npcInfo = this.services.getNpcInfo(npcKey);
        if (isNaN(stack)) {
            return this.sendError(data, socket, "Stack value is invalid.");
        } else if (!npcInfo) {
            return this.sendError(data, socket, "No npc with such key.");
        } else if (npcInfo.room !== socket.character.room) {
            return this.sendError(data, socket, "The npc is in a different room than you!");
        } else if (!npcInfo.sell || !npcInfo.sell[index]) {
            return this.sendError(data, socket, "The npc does not sell the item you want.");
        }
        let itemInfo = this.itemsRouter.getItemInfo(npcInfo.sell[index].key);
        let goldValue = itemInfo.gold * stack;
        if (goldValue > socket.character.gold) {
            return this.sendError(data, socket, "Not enough money to buy the item.");
        }
        let itemInstance = this.itemsRouter.getItemInstance(itemInfo.key);
        if (itemInfo.cap > 1) {
            itemInstance.stack = stack;
        }
        let callback = () => {
            let goldItem = this.goldRouter.getGoldItem(goldValue);
            this.emitter.emit(itemsConfig.SERVER_INNER.ITEM_REMOVE.name, {item: goldItem}, socket);

            socket.emit(npcsConfig.CLIENT_GETS.TRANSACTION.name, {});
        }
        this.emitter.emit(itemsConfig.SERVER_INNER.ITEM_PICK.name, {item: itemInstance, callback}, socket);
    }
    
	[npcsConfig.SERVER_GETS.ITEM_SELL.name](data, socket: GameSocket) {
        let {npcKey, slot, stack} = data;
        stack = Math.abs(stack || 1);
        let item = socket.character.items[slot];
        let npcInfo = this.services.getNpcInfo(npcKey);
        if (isNaN(stack)) {
            return this.sendError(data, socket, "Stack value is invalid.");
        } else if (!npcInfo) {
            return this.sendError(data, socket, "No npc with such key.");
        } else if (npcInfo.room !== socket.character.room) {
            return this.sendError(data, socket, "The npc is in a different room than you!");
        } else if (!npcInfo.sell) {
            return this.sendError(data, socket, "The npc is not a vendor, he's just a peasant.");
        } else if (!this.itemsRouter.hasItem(socket, slot)) {
            return this.sendError(data, socket, "No item in the given slot.");
        } else if (stack > 1 && (!item.stack || stack > item.stack)) {
            return this.sendError(data, socket, "Stack given is more than the amount that available in that slot.");
        }
        this.emitter.emit(itemsConfig.SERVER_INNER.ITEM_REMOVE.name, {item: { stack, key: item.key }, slot}, socket);
        
        let itemInfo = this.itemsRouter.getItemInfo(item.key);
        let gold = this.services.getGoldValueForSale(itemInfo, stack);
        let goldItem = this.goldRouter.getGoldItem(gold);
        this.emitter.emit(itemsConfig.SERVER_INNER.ITEM_ADD.name, { item: goldItem }, socket);        

        socket.emit(npcsConfig.CLIENT_GETS.TRANSACTION.name, {});
	}
};