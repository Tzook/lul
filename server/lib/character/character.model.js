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
        let coloredItem = {
            sprite: String, // sprite string
            color: String // hex color
        };
        let pos = {
            x: {type: Number, default: 0},
            y: {type: Number, default: 0}
        };
        let looks = {
            g: Boolean, // 0 male, 1 female
            hair: coloredItem,
            eyes: String, // sprite string
            nose: String, // sprite string
            mouth: String, // sprite string
            skin: String // hex color
        };
        this.schema = {
            name: String,
            pos,
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