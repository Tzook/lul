'use strict';
let ModelBase = require('../master/master.model.js');

/**
 * Movement's Model
 */
class MovementModel extends ModelBase {
   init(files, app) {
        this.addToCharacterSchema = {
            position: {
                x: {type: Number, default: 0},
                y: {type: Number, default: 0},
                z: {type: Number, default: 0}
            }
        };
    }

    get priority() {
        return 20;
    }

    createModel() {
        this.addToSchema('Character', this.addToCharacterSchema);
        return Promise.resolve();
    }
}

module.exports = MovementModel;