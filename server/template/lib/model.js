'use strict';
let ModelBase = require('../master/master.model.js');

/**
 * Template's Model
 */
class TemplateModel extends ModelBase {	
    /**
     * Creates the schema of the model
     */
    init(files, app) {
        this.schema = {
            something: String
        };
        this.listenForSchemaAddition('Template');
    }
     
    get priority() {
        return 1;
    }
    
    createModel() {
        this.setModel('Template');
        this.removeListen('Template');
        return Promise.resolve();
    }
}

module.exports = TemplateModel;