'use strict';
import Emitter = require('events');
let emitter = new Emitter.EventEmitter();

export default class MasterModel {
    protected mongoose;
    protected model;
    protected schema;

    constructor(mongoose: any) {
        this.mongoose = mongoose || require('mongoose');
    }

    init(files, app) {

    }

    createModel() {
        // inherit me!
        return Promise.resolve();
    }

    setModel(name) {
        try {
            this.model = this.mongoose.model(name);
        } catch (e) {
            this.model = this.mongoose.model(name, this.mongoose.Schema(this.schema));
        }
    }

    getModel(name?) {
        return name ? this.mongoose.model(name) : this.model;
    }

    get priority() {
        return 1;
    }

    addToSchema(model, data) {
        emitter.emit(model + "Schema", data);
    }

    listenForSchemaAddition(model) {
        emitter.on(model + "Schema", this.addModelToSchema.bind(this));
    }

    removeListen(model) {
        emitter.removeListener(model + "Schema", this.addModelToSchema.bind(this));
    }

    private addModelToSchema(data) {
        for (let i in data) {
            this.schema[i] = data[i];
        }
    }
};