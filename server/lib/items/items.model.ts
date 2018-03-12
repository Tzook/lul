
import MasterModel from '../master/master.model';
import ItemsController from './items.controller';
import config from '../items/items.config';
import { PRIORITY_CHAR } from '../character/character.model';

export const REQUIRE_SCHEMA = {
    lvl: Number,
};

export let ITEM_SCHEMA = {
    key: String,
    type: String,
    gold: Number,
    chance: Number,
    cap: Number,
    req: REQUIRE_SCHEMA,
};

export let ITEM_INSTANCE_SCHEMA = {
    key: String,
    stack: Number,
};

export const PRIORITY_ITEM = PRIORITY_CHAR + 10;

export default class ItemsModel extends MasterModel {
    protected controller: ItemsController;

    init(files, app) {
        this.controller = files.controller;

        this.listenForSchemaAddition('Item');
        this.listenForSchemaAddition('ItemInstance', () => ITEM_INSTANCE_SCHEMA);
        this.minimize = true;
        this.schema = ITEM_SCHEMA;
    }

    get priority() {
        return PRIORITY_ITEM;
    }

    createModel() {
        this.setModel("Item");

        let ItemInstanceModel = this.createNewModel("ItemInstance", ITEM_INSTANCE_SCHEMA, {_id: false});
        this.addToSchema("Character", {items: [ItemInstanceModel.schema]});
        let items = [];
        for (var i = 0; i < config.MAX_ITEMS; i++) {
            items[i] = new ItemInstanceModel({});
        }
        this.listenForFieldAddition("Character", "items", items);
        
        setTimeout(() => this.controller.warmItemsInfo()); // timeout so the Model can be set
        this.removeListen('Item');
        this.removeListen('ItemInstance');
        return Promise.resolve();
    }
};