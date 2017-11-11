import MasterModel from '../master/master.model';
import TalentsController from './talents.controller';
import * as mongoose from "mongoose"; 

const ABILITY_PERK_SCHEMA = (<any>mongoose.Schema)({
    atLeastLvl: Number,
    perksOffered: Number,
    addToPool: [String]
}, {_id: false});

const TALENT_SCHEMA = {
    ability: String,
    perks: [ABILITY_PERK_SCHEMA],
};

const CHAR_TALENT_SCHEMA = {

};

export default class TalentsModel extends MasterModel {
    protected controller: TalentsController;

    init(files, app) {
        this.controller = files.controller;

        this.schema = TALENT_SCHEMA;
        this.minimize = true;
    }

    get priority() {
        return 35;
    }

    createModel() {
        this.setModel("Talent");

        let CharTalentsModel = this.createNewModel("CharTalents", CHAR_TALENT_SCHEMA, {_id: false, strict: false, minimize: false});
        this.addToSchema("Character", {talents: CharTalentsModel.schema});
        this.listenForFieldAddition("Character", "talents", CHAR_TALENT_SCHEMA);
        
        setTimeout(() => this.controller.warmTalentsInfo()); // timeout so the Model can be set
        return Promise.resolve();
    }
};