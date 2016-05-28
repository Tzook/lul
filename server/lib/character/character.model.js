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
            g: Boolean
        };
        this.schema = {
            name: String,
            looks
        };
        this.listenForSchemaAddition('Character');
    }

    get priority() {
        return 10;
    }

    createModel() {
        this.setModel('Character');
        this.addToSchema('User', {characters: [this.getModel().schema]});
        this.removeListen('Character');
        return Promise.resolve();
    }
}

module.exports = CharacterModel;