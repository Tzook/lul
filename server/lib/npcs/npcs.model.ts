import MasterModel from '../master/master.model';
import NpcsController from "./npcs.controller";

export default class NpcsModel extends MasterModel {
    protected controller: NpcsController;

    init(files, app) {
        this.controller = files.controller;
        this.schema = {
            key: String,
            room: String,
            sell: this.mongoose.Schema.Types.Mixed,
            givingQuests: this.mongoose.Schema.Types.Mixed,
            endingQuests: this.mongoose.Schema.Types.Mixed,
        };
        this.hasId = false; // it actually has an id but saved only in the db
        this.strict = false;
    }

    get priority() {
        return 15;
    }

    createModel() {
        this.setModel('Npcs');
        setTimeout(() => this.controller.warmNpcsInfo()); // timeout so the Model can be set
        return Promise.resolve();
    }
};