
import MasterModel from '../master/master.model';

export default class UserModel extends MasterModel {

    init(files, app) {
        this.schema = {
            username: String,
            password: String
        };
        this.listenForSchemaAddition('User');
    }

    get priority() {
        return 1;
    }

    createModel() {
        this.setModel('User');
        this.removeListen('User');
        return Promise.resolve();
    }
};