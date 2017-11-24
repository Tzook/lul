import MasterModel from '../master/master.model';
import TalentsController from './talents.controller';
import statsConfig from '../stats/stats.config';
import * as mongoose from "mongoose"; 
import TalentsServices from './talents.services';
import { PRIORITY_CHAR } from '../character/character.model';
import { PRIORITY_CONFIG } from '../socketio/socketio.model';

const ABILITY_PERK_SCHEMA = (<any>mongoose.Schema)({
    atLeastLvl: Number,
    perksOffered: Number,
    addToPool: [String]
}, {_id: false});

const TALENT_SCHEMA = {
    ability: String,
    perks: [ABILITY_PERK_SCHEMA],
};

const CONFIG_PERK_SCHEMA = mongoose.Schema.Types.Mixed;

const CHAR_TALENT_SCHEMA = mongoose.Schema.Types.Mixed;

export const PRIORITY_TALENTS = PRIORITY_CHAR + PRIORITY_CONFIG + 10;

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

        let CharTalentsModel = this.createNewModel("CharTalents", CHAR_TALENT_SCHEMA, {_id: false, strict: false, minimize: false});
        this.addToSchema("Character", {talents: CharTalentsModel.schema});
        const charTalentsInitialValue = {
            [statsConfig.ABILITY_MELEE]: this.services.getEmptyCharAbility()
        };
        this.listenForFieldAddition("Character", "talents", charTalentsInitialValue);
        
        this.addToSchema("Config", { perks: CONFIG_PERK_SCHEMA });
        
        setTimeout(() => this.controller.warmTalentsInfo()); // timeout so the Model can be set
        return Promise.resolve();
    }
};