import MasterModel from '../master/master.model';
import * as mongoose from 'mongoose';
import { PRIORITY_ITEM } from '../items/items.model';

const ITEMS_TALENTS_SCHEMA = {
    perks: mongoose.Schema.Types.Mixed
};

export const PRIORITY_BONUS_PERKS = PRIORITY_ITEM + 10;

export default class BonusPerksModel extends MasterModel {

    init(files, app) {
        
    }

    get priority() {
        return PRIORITY_BONUS_PERKS;
    }

    createModel() {
        this.addToSchema("Item", ITEMS_TALENTS_SCHEMA);
        this.addToSchema("ItemInstance", ITEMS_TALENTS_SCHEMA);

        return Promise.resolve();
    }
};

export function extendItemSchemaWithTalents(item: any, itemSchema: ITEM_MODEL) {
    (item.perks || []).forEach(perk => {
		itemSchema.perks = itemSchema.perks || {};
		itemSchema.perks[perk.key] = +perk.value;
	});
}