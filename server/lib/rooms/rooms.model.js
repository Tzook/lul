'use strict';
let ModelBase = require('../master/master.model.js');

/**
 * Rooms's Model
 */
class RoomsModel extends ModelBase {
    /**
     * Creates the schema of the model
     */
    init(files, app) {
        this.schema = {
            name: String,
            capacity: {type: Number, defualt: 0},
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
}

module.exports = RoomsModel;