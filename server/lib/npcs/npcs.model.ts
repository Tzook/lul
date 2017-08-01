import MasterModel from '../master/master.model';

export default class NpcsModel extends MasterModel {
    init(files, app) {
        this.schema = {
            key: String,
            room: String,
            // TODO sell
        };
        this.hasId = false; // it actually has an id but saved only in the db
        this.strict = false;
    }

    get priority() {
        return 15;
    }

    createModel() {
        this.setModel('Npcs');

        return Promise.resolve();
    }
};