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
                return Promise.reject({ error: error, params: { param: fields[i].param } });
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
        return this.promiseByCondition(item >= start && item <= end, [], { error: error, params: { param: param } });
    }
    inArray(needle, hay, error, param) {
        return this.promiseByCondition(hay.indexOf(needle) !== -1, [], { error: error, params: { param: param } });
    }
    isBool(item, error, param) {
        return this.inArray(item, ["0", "1"], error, param);
    }
    invalidatesRegex(item, pattern, error, param) {
        return this.promiseByCondition(!pattern.test(item), [], { error: error, params: { param: param } });
    }
}
;
module.exports = ServicesBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzdGVyLnNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9tYXN0ZXIvbWFzdGVyLnNlcnZpY2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUViOztHQUVHO0FBQ0g7SUFDSSxZQUFZLENBQUMsRUFBRSxHQUFHO1FBQ2QsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRDs7T0FFQTtJQUNILElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRztRQUNkLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxxQkFBcUI7SUFDNUQsQ0FBQztJQUVFLFFBQVEsQ0FBQyxLQUFLO1FBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ2pCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDekIsTUFBTSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsU0FBUyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSztRQUN4QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ25CLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUMsT0FBQSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUMsRUFBQyxDQUFDLENBQUM7WUFDckUsQ0FBQztRQUNMLENBQUM7UUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQ7Ozs7OztPQU1HO0lBQ0gsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsTUFBTTtRQUN2QixHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ25CLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsQ0FBQztRQUNELE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNILFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztRQUNYLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDUixNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxXQUFXLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEtBQUssS0FBSyxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCxhQUFhLENBQUMsR0FBRyxFQUFFLE1BQU07UUFDckIsR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztZQUN2QixHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEtBQUssR0FBRyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ25ELENBQUM7UUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsT0FBTyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLO1FBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxJQUFJLEtBQUssSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFDLE9BQUEsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUFDLE9BQUEsS0FBSyxFQUFDLEVBQUMsQ0FBQyxDQUFDO0lBQy9GLENBQUM7SUFFRCxPQUFPLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsS0FBSztRQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUMsT0FBQSxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUMsT0FBQSxLQUFLLEVBQUMsRUFBQyxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUs7UUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSztRQUN4QyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBQyxPQUFBLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBQyxPQUFBLEtBQUssRUFBQyxFQUFDLENBQUMsQ0FBQztJQUN0RixDQUFDO0FBQ0wsQ0FBQztBQUFBLENBQUM7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFlBQVksQ0FBQyJ9