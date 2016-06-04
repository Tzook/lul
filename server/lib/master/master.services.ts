'use strict';

export default class MasterServices {
    protected Q;
    protected mongoose;
    protected Model;

    constructor(Q, MD5) {
        this.Q = Q || require('q');
    }

	init(files, app) {
		this.mongoose = files.model.mongoose; // TODO app.mongoose!
	}

    setModel(Model) {
		this.Model = Model;
    }

    promiseByCondition(cond, d, e) {
        return cond ? Promise.resolve(d) : Promise.reject(e);
    }

    hasFields(obj, fields, error) {
        for (let i in fields) {
            if (!obj[fields[i].param]) {
                return Promise.reject({error, params: {param: fields[i].param}});
            }
        }
        return Promise.resolve(obj);
    }

    copyFields(src, dst, fields) {
        for (let i in fields) {
            dst[fields[i]] = src[fields[i]];
        }
        return Promise.resolve(dst);
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

    isBool(item, error, param) {
        return this.inArray(item, ["0", "1"], error, param);
    }

    invalidatesRegex(item, pattern, error, param) {
        return this.promiseByCondition(!pattern.test(item), [], {error, params: {param}});
    }
};