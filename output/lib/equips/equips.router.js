'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let config = require('../../../server/lib/equips/equips.config.json');
let dropsConfig = require('../../../server/lib/drops/drops.config.json');
let statsConfig = require('../../../server/lib/stats/stats.config.json');
let SERVER_GETS = config.SERVER_GETS;
class EquipsRouter extends socketio_router_base_1.default {
    init(files, app) {
        super.init(files, app);
        this.mongoose = files.model.mongoose;
        this.itemsRouter = files.routers.items;
    }
    initRoutes(app) {
        app.post(this.ROUTES.BEGIN, this.middleware.validateHasSercetKey.bind(this.middleware), this.controller.beginEquips.bind(this.controller));
    }
    [SERVER_GETS.EQUIP_ITEM.name](data, socket) {
        let from = data.from;
        let to = data.to;
        if (this.middleware.isValidItemSlot(from)
            && this.middleware.isValidEquipSlot(to)
            && this.middleware.hasItem(socket, from)) {
            let item = socket.character.items[from];
            let itemInfo = this.itemsRouter.getItemInfo(item.key);
            if (!itemInfo) {
                this.sendError(data, socket, "Could not find item info for item " + item.key);
            }
            else if (!this.middleware.canWearEquip(socket, itemInfo, to)) {
                this.sendError(data, socket, "Item cannot be equipped there");
            }
            else {
                this.removeStats(to, socket);
                this.middleware.swapEquipAndItem(socket, from, to);
                this.addStats(to, socket);
                this.io.to(socket.character.room).emit(this.CLIENT_GETS.EQUIP_ITEM.name, {
                    id: socket.character._id,
                    from,
                    to,
                    equipped_item: item,
                });
            }
        }
        else {
            this.sendError(data, socket, "Invalid slots!");
        }
    }
    [SERVER_GETS.UNEQUIP_ITEM.name](data, socket) {
        let from = data.from;
        let to = data.to;
        if (this.middleware.isValidEquipSlot(from)
            && this.middleware.isValidItemSlot(to)
            && this.middleware.hasEquip(socket, from)) {
            if (this.middleware.hasItem(socket, to)
                && !this.middleware.canWearEquip(socket, this.itemsRouter.getItemInfo(socket.character.items[to].key), from)) {
                this.sendError(data, socket, "Cannot unequip to slot!");
            }
            else {
                this.removeStats(from, socket);
                this.middleware.swapEquipAndItem(socket, to, from);
                this.addStats(from, socket);
                this.io.to(socket.character.room).emit(this.CLIENT_GETS.UNEQUIP_ITEM.name, {
                    id: socket.character._id,
                    from,
                    to,
                    equipped_item: socket.character.equips[from],
                });
            }
        }
        else {
            this.sendError(data, socket, "Invalid slots!");
        }
    }
    [SERVER_GETS.USE_EQUIP.name](data, socket) {
        let slot = this.middleware.getFirstAvailableSlot(socket);
        if (slot >= 0) {
            this[SERVER_GETS.UNEQUIP_ITEM.name]({
                from: data.slot,
                to: slot
            }, socket);
        }
        else {
            this.sendError(data, socket, "Cannot unequip to slot!");
        }
    }
    [SERVER_GETS.USE_ITEM.name](data, socket) {
        let itemSlot = data.slot;
        if (this.middleware.isValidItemSlot(itemSlot)) {
            let item = socket.character.items[itemSlot];
            let itemInfo = this.itemsRouter.getItemInfo(item.key);
            if (!itemInfo) {
                this.sendError(data, socket, "Could not find item info for item " + item.key);
            }
            else if (this.middleware.isValidEquipItem(itemInfo)) {
                this[SERVER_GETS.EQUIP_ITEM.name]({
                    from: itemSlot,
                    to: itemInfo.type
                }, socket);
            }
            else {
                this.sendError(data, socket, "Item not equipable!");
            }
        }
        else {
            this.sendError(data, socket, "Invalid slot!");
        }
    }
    [SERVER_GETS.DROP_EQUIP.name](data, socket) {
        let slot = data.slot;
        if (this.middleware.hasEquip(socket, slot)) {
            let equip = socket.character.equips[slot];
            this.emitter.emit(dropsConfig.SERVER_INNER.ITEMS_DROP.name, {}, socket, [equip]);
            this.removeStats(slot, socket);
            let ItemsModels = this.mongoose.model("Item");
            socket.character.equips[slot] = new ItemsModels({});
            this.io.to(socket.character.room).emit(this.CLIENT_GETS.DELETE_EQUIP.name, {
                id: socket.character._id,
                slot
            });
        }
        else {
            this.sendError(data, socket, "Invalid slot!");
        }
    }
    addStats(slot, socket) {
        let equip = socket.character.equips[slot];
        this.emitter.emit(statsConfig.SERVER_INNER.STATS_ADD.name, { stats: equip }, socket);
    }
    removeStats(slot, socket) {
        let equip = socket.character.equips[slot];
        this.emitter.emit(statsConfig.SERVER_INNER.STATS_REMOVE.name, { stats: equip }, socket);
    }
}
exports.default = EquipsRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXF1aXBzLnJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvZXF1aXBzL2VxdWlwcy5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUlsRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQztBQUN0RSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUN6RSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUN6RSxJQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO0FBRXJDLGtCQUFrQyxTQUFRLDhCQUFrQjtJQU0zRCxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDZCxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7SUFDeEMsQ0FBQztJQUVTLFVBQVUsQ0FBQyxHQUFHO1FBQ3ZCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQ3pCLElBQUksQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFDMUQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQWtCO1FBQ3JELElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxJQUFJ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