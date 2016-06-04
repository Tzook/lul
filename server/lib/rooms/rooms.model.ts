'use strict';
import MasterModel from '../master/master.model';

export default class RoomsModel extends MasterModel {
    private addToCharacterSchema;

    init(files, app) {
        this.schema = {
            name: String,
            capacity: {type: Number, default: 0},
            users: [this.mongoose.Schema.ObjectId]
        };
        this.addToCharacterSchema = {
            room: {type: String, default: files.config.ROOM_NAMES.DEFAULT_ROOM}
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