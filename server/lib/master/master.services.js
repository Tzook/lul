'use strict';

/**
 *  Services base class to manage services
 */
class ServicesBase {
    constructor(Q, MD5) {
        this.Q = Q || require('q');
    }
    
    /**
	 * Initializes the instance
	 */
	init(files, app) {
		this.mongoose = files.model.mongoose; // TODO app.mongoose!
	}
    
    setModel(Model) {
		this.Model = Model;        
    }
    
    /**
     * Returns a promise that is fulfilled or rejected by the condition
     * @param {Boolean} cond
     * @param {*} d Thing to resolve
     * @param {*} e Error to reject
     * @returns Promise
     */
    promiseByCondition(cond, d, e) {
        return cond ? Promise.resolve(d) : Promise.reject(e);
    }
    
    /**
     * Checks if all fields in "fields" appear in "obj"
     * @param {Object} obj
     * @param {Array[String]} fields For example: ["username", "password"]
     * @returns Promise
     */
    hasFields(obj, fields, error) {
        for (let i in fields) {
            if (!obj[fields[i].param]) {
                return Promise.reject({error, params: {param: fields[i].param}});
            }
        }
        return Promise.resolve(obj);
    }
    
    /**
     * Copies from "src" to "dst" all the fields that "fields" has
     * @param {Object} src
     * @param {Object} dst
     * @param {Array[String]} fields For example: ["username", "password"]
     * @returns Promise
     */
    copyFields(src, dst, fields) {
        for (let i in fields) {
            dst[fields[i]] = src[fields[i]];
        }
        return Promise.resolve(dst);
    }
    
    /**
     * Returns a resolved promise if d is not empty, otherwise rejected promise
     * @param {*} d 
     * @param {*} e
     * @returns Promise
     */
    isNotEmpty(d, e) {
        return this.promiseByCondition(d, d, e);
    }
    
    /**
     * Returns a resolved promise if d is empty, otherwise rejected promise
     * @param {*} d 
     * @param {*} e
     * @returns Promise
     */
    isEmpty(d, e) {
        return this.promiseByCondition(!d, d, e);
    }
    
    /**
     * Returns a promise that is resolved or rejects if "item1" equals "item2"
     * @param {*} d 
     * @param {*} e
     * @returns Promise
     */
    checkEquals(item1, item2, d, e) {
        return this.promiseByCondition(item1 === item2, d, e);
    }
    
    /**
     * Returns a promise that is resolved with the string replaced by all the tokens in "tokens"
     * For example, msg would be "hello {person}, how are you?" and tokens would be {person: "john"}
     * @param String msg
     * @param Object tokens
     * @returns Promise
     */
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

module.exports = ServicesBase;