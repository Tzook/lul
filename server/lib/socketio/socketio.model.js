'use strict';
let ModelBase = require('../master/master.model.js');

/**
 * Socketio's Model
 */
class SocketioModel extends ModelBase {	
    /**
     * Creates the schema of the model
     */
    init(files, app) {
        this.rooms = [1, 2, 3]; // TODO from config
        this.users = new Map();
    }
}

module.exports = SocketioModel;