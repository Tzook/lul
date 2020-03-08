import MasterModel from "../master/master.model";
import NpcsController from "./npcs.controller";

export const PRIORITY_NPCS = 10;

export default class NpcsModel extends MasterModel {
    protected controller: NpcsController;

    init(files, app) {
        this.controller = files.controller;
        this.schema = {
            key: String,
            room: String,
            sell: {},
            givingQuests: {},
            endingQuests: {},
            teleportRooms: {},
        };
        this.hasId = false; // it actually has an id but saved only in the db
        this.strict = false;
    }

    get priority() {
        return PRIORITY_NPCS;
    }

    createModel() {
        this.setModel("Npcs");
        setTimeout(() => this.controller.warmNpcsInfo()); // timeout so the Model can be set
        return Promise.resolve();
    }
}
