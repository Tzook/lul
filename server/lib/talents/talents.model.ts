import MasterModel from '../master/master.model';
import TalentsController from './talents.controller';


const TALENTS_SCHEMA = {
    key: String,
};

const CHAR_TALENTS_SCHEMA = {

};

export default class TalentsModel extends MasterModel {
    protected controller: TalentsController;

    init(files, app) {
        this.controller = files.controller;

        this.schema = TALENTS_SCHEMA;
        this.minimize = true;
    }

    get priority() {
        return 35;
    }

    createModel() {
        this.setModel("Talent");

        let CharTalentsModel = this.createNewModel("CharTalents", CHAR_TALENTS_SCHEMA, {_id: false, strict: false, minimize: false});
        this.addToSchema("Character", {talents: CharTalentsModel.schema});
        this.listenForFieldAddition("Character", "talents", CHAR_TALENTS_SCHEMA);
        
        setTimeout(() => this.controller.warmTalentsInfo()); // timeout so the Model can be set
        return Promise.resolve();
    }
};