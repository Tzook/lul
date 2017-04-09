'use strict';
import MasterModel from '../master/master.model';
import RoomsController from "./rooms.controller";

interface PORTAL_SCHEMA {
    x: number,
    y: number,
};

interface SPAWN_SCHEMA {
    cap: number,
    interval: number,
    x: number,
    y: number,
};

export interface ROOM_SCHEMA {
    name: string,
    portals: {
        [targetPortal: string]: PORTAL_SCHEMA
    },
    spawns: {
        [mobId: string]: SPAWN_SCHEMA
    },
};

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
        this.hasId = false;
        this.strict = false;

        this.addToCharacterSchema = {
            room: {type: String, default: files.config.DEFAULT_ROOM}
        };
    }

    get priority() {
        return 20;
    }

    createModel() {
        this.setModel('Rooms');
        this.addToSchema('Character', this.addToCharacterSchema);

		setTimeout(() => this.controller.warmRoomInfo()); // timeout so the Model can be set
        return Promise.resolve();
    }
};