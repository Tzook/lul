'use strict';
import MasterModel from '../master/master.model';

export default class RoomsModel extends MasterModel {
    private addToCharacterSchema;

    init(files, app) {
        let portal = this.mongoose.Schema({
            target: String,
            x: Number,
            y: Number,
        }, {_id: false});

        let spawn = this.mongoose.Schema({
            mob: String,
            cap: Number,
            interval: Number,
            x: Number,
            y: Number,
        }, {_id: false});

        this.schema = {
            name: String,
            portals: [portal],
            spawns: [spawn]
        };
        this.hasId = false;

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
        return Promise.resolve();
    }
};