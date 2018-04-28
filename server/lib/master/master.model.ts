
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
    protected params: {versionKey?: boolean};

    constructor() {
        this.mongoose = mongoose;
        this.hasId = true;
        this.strict = true;
        this.minimize = false;
        this.params = {};
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
        return this.mongoose.model(name, new this.mongoose.Schema(schema, Object.assign({_id: this.hasId, minimize: this.minimize, strict: this.strict}, this.params, params)));
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

    protected listenForSchemaAddition(model, schemaGetter = () => this.schema) {
        emitter.on(model + "Schema", (data) => this.addModelToSchema(data, schemaGetter));
    }

    removeListen(model) {
        emitter.removeAllListeners(model + "Schema");
    }

    private addModelToSchema(data, schemaGetter: () => any) {
        let schema = schemaGetter();
        for (let i in data) {
            schema[i] = data[i];
        }
    }

    protected listenForFieldAddition(model: string, field: string, data: any = "") {
        emitter.on(model + "Field", this.addFieldToModel.bind(this, field, data));
    }

    addFields(obj, reqBody) {
        emitter.emit(this.model.modelName + "Field", obj, reqBody);
    }

    protected addFieldToModel(field, data, obj, reqBody) {
        data = typeof data === "function" ? data() : data;
        obj[field] = data;
    }
};