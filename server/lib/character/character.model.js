'use strict';
let ModelBase = require('../master/master.model.js');
let RoomsConfig = require('../rooms/rooms.config.json');

/**
 * Character's Model
 */
class CharacterModel extends ModelBase {
    /**
     * Creates the schema of the model
     */
    init(files, app) {
        let looks = {
            g: Boolean
        };
        this.schema = {
            name: String,
            looks,
            room: {type: String, default: RoomsConfig.ROOM_NAMES.DEFAULT_ROOM}
        };
    }

    get priority() {
        return 10;
    }

    createModel() {
        this.setModel('Character');
        this.addToSchema('User', {characters: [this.getModel().schema]});
        return Promise.resolve();
    }
}

module.exports = CharacterModel;