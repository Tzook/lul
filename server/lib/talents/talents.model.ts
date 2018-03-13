import MasterModel from '../master/master.model';
import TalentsController from './talents.controller';
import statsConfig from '../stats/stats.config';
import * as mongoose from "mongoose"; 
import TalentsServices from './talents.services';
import { PRIORITY_CHAR } from '../character/character.model';
import { PRIORITY_CONFIG } from '../socketio/socketio.model';
import { PRIORITY_MOBS } from '../mobs/mobs.model';
import talentsConfig from './talents.config';
import { PRIORITY_ROOMS } from '../rooms/rooms.model';
import { PRIORITY_ITEM } from '../items/items.model';

const ABILITY_PERK_SCHEMA = (<any>mongoose.Schema)({
    atLeastLvl: Number,
    perksOffered: Number,
    addToPool: [String]
}, {_id: false});

const ABILITY_SPELL_SCHEMA = (<any>mongoose.Schema)({
    key: String,
    lvl: Number,
    mp: Number,
    perks: mongoose.Schema.Types.Mixed
}, {_id: false});

const TALENT_SCHEMA = {
    ability: String,
    perks: [ABILITY_PERK_SCHEMA],
    spells: [ABILITY_SPELL_SCHEMA],
    info: {
        powerType: String,
        hitType: String,
        mp: Number,
        initPerks: mongoose.Schema.Types.Mixed
    }
};

const CONFIG_PERK_SCHEMA = mongoose.Schema.Types.Mixed;

const CHAR_TALENTS_SCHEMA = mongoose.Schema.Types.Mixed;

const ITEMS_TALENTS_SCHEMA = {
    perks: mongoose.Schema.Types.Mixed
};

const MOB_PERKS_SPELLS_SCHEMA = {
    perks: mongoose.Schema.Types.Mixed,
    spells: mongoose.Schema.Types.Mixed,
};

const ROOM_ABILITIES_SCHEMA = {
    abilities: mongoose.Schema.Types.Mixed
};

export const PRIORITY_TALENTS = PRIORITY_CHAR + PRIORITY_MOBS + PRIORITY_ROOMS + PRIORITY_ITEM +  PRIORITY_CONFIG + 10;

export default class TalentsModel extends MasterModel {
    protected controller: TalentsController;
    protected services: TalentsServices;

    init(files, app) {
        this.controller = files.controller;
        this.services = files.services;

        this.schema = TALENT_SCHEMA;
        this.minimize = true;
    }

    get priority() {
        return PRIORITY_TALENTS;
    }

    createModel() {
        this.setModel("Talent");

        let CharTalentsModel = this.createNewModel("CharTalents", CHAR_TALENTS_SCHEMA, {_id: false, strict: false, minimize: false});
        this.addToSchema("Character", {talents: CharTalentsModel.schema});
        const charTalentsInitialValue = () => ({
            [statsConfig.ABILITY_MELEE]: this.services.getEmptyCharAbility(statsConfig.ABILITY_MELEE)
        });
        this.listenForFieldAddition("Character", "talents", charTalentsInitialValue);
        
        this.addToSchema("Character", {charTalents: CharTalentsModel.schema});
        this.listenForFieldAddition("Character", "charTalents", () => ({
            [talentsConfig.CHAR_TALENT]: this.services.getEmptyCharAbility(talentsConfig.CHAR_TALENT)
        }));
        
        this.addToSchema("Mobs", MOB_PERKS_SPELLS_SCHEMA);
        
        this.addToSchema("Rooms", ROOM_ABILITIES_SCHEMA);
        
        this.addToSchema("Item", ITEMS_TALENTS_SCHEMA);
        this.addToSchema("ItemInstance", ITEMS_TALENTS_SCHEMA);
        
        this.addToSchema("Config", { perks: CONFIG_PERK_SCHEMA });
        
        setTimeout(() => this.controller.warmTalentsInfo()); // timeout so the Model can be set
        return Promise.resolve();
    }
};