
import MasterModel from '../master/master.model';
import { PRIORITY_USER } from '../user/user.model';

export const PRIORITY_CHAR = 10;

export default class CharacterModel extends MasterModel {

    init(files, app) {
        let looks = {
            g: Boolean,
            eyes: String,
            nose: String,
            mouth: String,
            skin: String,
            hair: String
        };
        this.schema = {
            name: String,
            looks
        };
        this.listenForSchemaAddition('Character');
    }

    get priority() {
        return PRIORITY_USER + PRIORITY_CHAR;
    }

    createModel() {
        this.setModel('Character');
        this.addToSchema('User', {characters: [this.getModel().schema]});
        this.removeListen('Character');
        return Promise.resolve();
    }
};