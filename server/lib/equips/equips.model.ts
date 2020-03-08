import * as _ from "underscore";
import { PRIORITY_CHAR } from "../character/character.model";
import { ITEM_INSTANCE_SCHEMA } from "../items/items.model";
import ItemsRouter from "../items/items.router";
import MasterModel from "../master/master.model";
import { PRIORITY_CONFIG } from "../socketio/socketio.model";
import SocketioRouter from "../socketio/socketio.router";

export const EQUIPS_SCHEMA = {
    head: ITEM_INSTANCE_SCHEMA,
    chest: ITEM_INSTANCE_SCHEMA,
    legs: ITEM_INSTANCE_SCHEMA,
    gloves: ITEM_INSTANCE_SCHEMA,
    shoes: ITEM_INSTANCE_SCHEMA,
    weapon: ITEM_INSTANCE_SCHEMA,
};

export const PRIORITY_EQUIPS = PRIORITY_CONFIG + PRIORITY_CHAR + 10;

export default class EquipsModel extends MasterModel {
    protected beginSchema;
    protected socketioRouter: SocketioRouter;
    protected itemsRouter: ItemsRouter;

    init(files, app) {
        this.socketioRouter = files.routers.socketio;
        this.itemsRouter = files.routers.items;
        this.hasId = false;
        this.schema = _.clone(EQUIPS_SCHEMA);
        this.beginSchema = _.clone(EQUIPS_SCHEMA);
        for (let i in this.schema) {
            this.schema[i] = {};
            this.beginSchema[i] = String;
        }
    }

    get priority() {
        return PRIORITY_EQUIPS;
    }

    createModel() {
        this.setModel("Equip");

        this.addToSchema("Character", { equips: this.getModel().schema });
        this.addToSchema("Config", { beginEquips: this.beginSchema });

        this.listenForFieldAddition("Character", "equips");

        return Promise.resolve();
    }

    protected addFieldToModel(field, data, obj: Char, reqBody) {
        let equips = _.clone(EQUIPS_SCHEMA);
        let ItemModel = this.getModel("ItemInstance");
        let config = this.socketioRouter.getConfig();
        for (let type in equips) {
            let itemInstance = this.itemsRouter.getItemInstance(config.beginEquips[type]) || {};
            equips[type] = new ItemModel(itemInstance);
        }
        obj[field] = equips;
        this.addFields(obj, reqBody);
    }
}
