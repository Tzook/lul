
import MasterModel from '../master/master.model';
import ItemsController from './items.controller';
import { BASE_STATS_SCHEMA } from "../stats/stats.model";
import config from '../items/items.config';

export const REQUIRE_SCHEMA = {
    str: Number,
    mag: Number,
    dex: Number,
    lvl: Number,
};

export const ITEM_SCHEMA = {
    key: String,
    type: String,
    gold: Number,
    chance: Number,
    cap: Number,
    stats: BASE_STATS_SCHEMA,
    req: REQUIRE_SCHEMA,
};

export const ITEM_INSTANCE_SCHEMA = Object.assign({
    key: String,
    stack: Number,
}, BASE_STATS_SCHEMA);

export default class ItemsModel extends MasterModel {
    protected controller: ItemsController;

    init(files, app) {
        this.controller = files.controller;

        this.schema = ITEM_SCHEMA;
    }

    get priority() {
        return 25;
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
        return Promise.resolve();
    }
};