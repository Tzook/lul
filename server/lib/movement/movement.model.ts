
import MasterModel from '../master/master.model';
import { PRIORITY_CHAR } from '../character/character.model';

export const PRIORITY_MOVEMENT = PRIORITY_CHAR + 10;

export default class MovementModel extends MasterModel {
    private addToCharacterSchema;

    init(files, app) {
        this.addToCharacterSchema = {
            position: {
                x: {type: Number, default: -74},
                y: {type: Number, default: -3},
                z: {type: Number, default: 0},
            }
        };
    }

    get priority() {
        return PRIORITY_MOVEMENT;
    }

    createModel() {
        this.addToSchema('Character', this.addToCharacterSchema);
        return Promise.resolve();
    }
};