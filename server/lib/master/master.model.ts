'use strict';
import Emitter = require('events');
import * as mongoose from "mongoose";
let emitter = new Emitter.EventEmitter();

export default class MasterModel {
    protected mongoose: typeof mongoose;
    protected model;
    protected schema;
    protected hasId: boolean;
    protected strict: boolean;
    protected minimize: boolean;

    constructor() {
        this.mongoose = mongoose;
        this.hasId = true;
        this.strict = true;
        this.minimize = false;
    }

    init(files, app) {

    }

    createModel() {
        return Promise.resolve();
    }

    setModel(name) {
        try {
            this.model = this.mongoose.model(name);
        } catch (e) {
            this.model = this.createNewModel(name, this.schema);
        }
    }

    protected createNewModel(name, schema, params = {}) {
        return this.mongoose.model(name, new this.mongoose.Schema(schema, Object.assign({_id: this.hasId, minimize: this.minimize, strict: this.strict}, params)));
    }

    getModel(name?) {
        return name ? this.mongoose.model(name) : this.model;
    }

    get priority() {
        return 1;
    }

    protected addToSchema(model, data) {
        emitter.emit(model + "Schema", data);
    }

    protected listenForSchemaAddition(model) {
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

    protected listenForFieldAddition(model: string, field: string, data?) {
        emitter.on(model + "Field", this.addFieldToModel.bind(this, field, data));
    }

    addFields(obj, reqBody) {
        emitter.emit(this.model.modelName + "Field", obj, reqBody);
    }

    protected addFieldToModel(field, data, obj, reqBody) {
        obj[field] = data;
    }
};