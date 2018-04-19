import MasterModel from '../master/master.model';
import * as mongoose from 'mongoose';
import { PRIORITY_ITEM } from '../items/items.model';
import { createBonusPerks } from './bonusPerks.services';
import talentsConfig from '../talents/talents.config';
import _ = require('underscore');

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

        this.listenForFieldAddition("Equip", "bonusPerksEquips");
        this.listenForFieldAddition("Stats", "bonusPerksStats");
        
        return Promise.resolve();
    }
    
    protected addFieldToModel(field, data, obj: Char, reqBody) {
        console.log("Updating", field, data, typeof obj);
        updateCharHpMp(obj);
    }
};

// we need both equips and stats to be added to character
var updateCharHpMp = _.after(2, function (char: Char) {
    // @ts-ignore
    let target: BONUS_PERKSABLE = {};
    createBonusPerks(target, char);
    if (target.bonusPerks[talentsConfig.PERKS.HP_BONUS]) {
        char.stats.hp.now += target.bonusPerks[talentsConfig.PERKS.HP_BONUS];
    }
    if (target.bonusPerks[talentsConfig.PERKS.MP_BONUS]) {
        char.stats.mp.now += target.bonusPerks[talentsConfig.PERKS.MP_BONUS];
    }
});

export function extendItemSchemaWithTalents(item: any, itemSchema: ITEM_MODEL) {
    (item.perks || []).forEach(perk => {
		itemSchema.perks = itemSchema.perks || {};
		itemSchema.perks[perk.key] = +perk.value;
	});
}