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
    }
    createModel() {
        this.setModel('Rooms');
        return Promise.resolve();
    }
}

module.exports = RoomsModel;