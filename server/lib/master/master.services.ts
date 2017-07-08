import * as mongoose from "mongoose";
import * as Q from "q";
import MasterModel from './master.model';

export default class MasterServices {
    protected Q;
    protected mongoose: typeof mongoose;
    protected model: MasterModel;
    protected Model: mongoose.Model<any>;

    constructor() {
        this.Q = Q;
    }

	init(files, app) {
        this.model = files.model;
		this.mongoose = files.model.mongoose;
	}

    setModel(Model) {
		this.Model = Model;
    }

    private promiseByCondition(cond, d, e) {
        return cond ? Promise.resolve(d) : Promise.reject(e);
    }

    isNotEmpty(d, e) {
        return this.promiseByCondition(d, d, e);
    }

    isEmpty(d, e) {
        return this.promiseByCondition(!d, d, e);
    }

    checkEquals(item1, item2, d, e) {
        return this.promiseByCondition(item1 === item2, d, e);
    }

    replaceTokens(msg, tokens) {
        for (let token in tokens) {
            msg = msg.replace(`{${token}}`, tokens[token]);
        }
        return Promise.resolve(msg);
    }

    inRange(item, start, end, error, param) {
        return this.promiseByCondition(item >= start && item <= end, [], {error, params: {param}});
    }

    inArray(needle, hay, error, param) {
        return this.promiseByCondition(hay.indexOf(needle) !== -1, [], {error, params: {param}});
    }

    invalidatesRegex(item, pattern, error, param) {
        return this.promiseByCondition(!pattern.test(item), [], {error, params: {param}});
    }
};