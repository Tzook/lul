import { PRIORITY_CHAR } from "../character/character.model";
import MasterModel from "../master/master.model";
import RoomsController from "./rooms.controller";

export const PRIORITY_ROOMS = PRIORITY_CHAR + 10;

export default class RoomsModel extends MasterModel {
    private addToCharacterSchema;
    protected controller: RoomsController;

    init(files, app) {
        this.controller = files.controller;

        this.schema = {
            name: String,
            portals: {},
            spawns: {},
        };
        this.hasId = false; // it actually has an id but saved only in the db
        this.strict = false;

        this.addToCharacterSchema = {
            room: { type: String, default: files.config.DEFAULT_ROOM },
        };
        this.listenForSchemaAddition("Rooms");
    }

    get priority() {
        return PRIORITY_ROOMS;
    }

    createModel() {
        this.setModel("Rooms");
        this.addToSchema("Character", this.addToCharacterSchema);

        setTimeout(() => this.controller.warmRoomsInfo()); // timeout so the Model can be set
        this.removeListen("Rooms");
        return Promise.resolve();
    }
}
