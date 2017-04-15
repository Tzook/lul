'use strict';
import MasterModel from '../master/master.model';

export default class MovementModel extends MasterModel {
    private addToCharacterSchema;

    init(files, app) {
        this.addToCharacterSchema = {
            position: {
                x: {type: Number, default: 0},
                y: {type: Number, default: 0},
                z: {type: Number, default: 0},
                climbing: {type: Boolean, default: false}
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
};