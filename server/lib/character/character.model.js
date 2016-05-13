'use strict';
let ModelBase = require('../master/master.model.js');

/**
 * Character's Model
 */
class CharacterModel extends ModelBase {
    /**
     * Creates the schema of the model
     */
    init(files, app) {
        let looks = {
            g: Boolean // 0 male, 1 female
        };
        this.schema = {
            name: String,
            looks,
            room: {type: Number, default: 1}
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