'use strict';
import MasterModel from '../master/master.model';
import RoomsController from "./rooms.controller";

export default class RoomsModel extends MasterModel {
    private addToCharacterSchema;
	protected controller: RoomsController;
    
    init(files, app) {
        this.controller = files.controller;

        this.schema = {
            name: String,
            portals: this.mongoose.Schema.Types.Mixed,
            spawns: this.mongoose.Schema.Types.Mixed
        };
        this.hasId = false; // it actually has an id but saved only in the db
        this.strict = false;

        this.addToCharacterSchema = {
            room: {type: String, default: files.config.DEFAULT_ROOM}
        };
    }

    createModel() {
        this.setModel('Rooms');
        this.addToSchema('Character', this.addToCharacterSchema);

		setTimeout(() => this.controller.warmRoomsInfo()); // timeout so the Model can be set
        return Promise.resolve();
    }
};