'use strict';
let ModelBase = require('../master/master.model.js');

/**
 * User's Model
 */
class UserModel extends ModelBase {	
    /**
     * Creates the schema of the model
     */
    init(files, app) {
        this.schema = {
            username: String,
            password: String,
            rooms: [String]
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
}

module.exports = UserModel;