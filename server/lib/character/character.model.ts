'use strict';
import MasterModel from '../master/master.model';

export default class CharacterModel extends MasterModel {

    init(files, app) {
        let looks = {
            g: Boolean,
            eyes: String,
            nose: String,
            mouth: String
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
};