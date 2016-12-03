'use strict';
import MasterModel from '../master/master.model';

export default class ItemsModel extends MasterModel {
    init(files, app) {
        this.hasId = false;

        this.schema = {
            name: String,
            icon: String,
        };
    }

    get priority() {
        return 25;
    }

    createModel() {
        this.setModel('Item');
        this.addToSchema('Character', {items: [this.getModel().schema]});
        return Promise.resolve();
    }
};