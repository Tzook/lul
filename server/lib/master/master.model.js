'use strict';
let emitter = new (require('events').EventEmitter)(); // TODO pass it along as param
/**
 *  Model base class to manage the model
 */
class ModelBase {
    /**
     * Default constructor
     */
    constructor(mongoose) {
        this.mongoose = mongoose || require('mongoose');
    }
    
    init(files, app) {
        
    }
    
    createModel() {
        // inherit me!
        return Promise.resolve();
    }
    
    /**
     * Sets the mongoose model.
     * If a previous model has been created, returns it instead
     */
    setModel(name) {
        try {
            this.model = this.mongoose.model(name);            
        } catch (e) {
            this.model = this.mongoose.model(name, this.mongoose.Schema(this.schema));
        }
    }
    
    /**
     * Returns the mongoose model
     */
    getModel(name) {
        return name ? this.mongoose.model(name) : this.model;
    }
    
    get priority() {
        return 1;
    }
    
    addToSchema(model, data) {
        emitter.emit(model + "Schema", data);
    }
    
    listenForSchemaAddition(model) {
        emitter.on(model + "Schema", addToSchema.bind(this));
    }
    
    removeListen(model) {
        emitter.removeListener(model + "Schema", addToSchema.bind(this));        
    }
};
function addToSchema(data) {
    for (let i in data) {
        this.schema[i] = data[i];
    }
}

module.exports = ModelBase;