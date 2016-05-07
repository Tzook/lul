'use strict';
let ServicesBase = require('../master/master.services.js');

/**
 * User's services
 */
class UserServices extends ServicesBase {
    /**
     * Registers a new user
     * @param {Object} body Has the fields username and password
     * @returns Promise
     */
    saveNewUser(body) {
        return this.Q.ninvoke(new this.Model(body), 'save');
    }
    
    /**
     * Gets a user from the database by id
     * @param {String} username
     * @returns Promise
     */
    getUser(username) {
        return this.Q.ninvoke(this.Model, 'findOne', {username});
    }
}

module.exports = UserServices;