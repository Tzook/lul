'use strict';
import Emitter = require('events');
let emitter = new Emitter.EventEmitter();

export default class MasterModel {
    protected mongoose;
    protected model;
    protected schema;
    protected hasId: boolean;

    constructor(mongoose: any) {
        this.mongoose = mongoose || require('mongoose');
        this.hasId = true;
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
            this.model = this.mongoose.model(name, this.mongoose.Schema(this.schema, {_id: this.hasId, minimize: false}));
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
        emitter.removeAllListeners(model + "Schema");
    }

    private addModelToSchema(data) {
        for (let i in data) {
            this.schema[i] = data[i];
        }
    }

    listenForFieldAddition(model: string, field: string, data) {
        emitter.on(model + "Field", this.addFieldToModel.bind(this, field, data));
    }

    addFields(obj, reqBody) {
        emitter.emit(this.model.modelName + "Field", obj, reqBody);
    }

    protected addFieldToModel(field, data, obj, reqBody) {
        obj[field] = data;
    }
};