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
        return this.Q.ninvoke(this.Model, 'findOne', { username: username });
    }
}
module.exports = UserServices;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zZXJ2aWNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvdXNlci91c2VyLnNlcnZpY2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBRTNEOztHQUVHO0FBQ0gsMkJBQTJCLFlBQVk7SUFDbkM7Ozs7T0FJRztJQUNILFdBQVcsQ0FBQyxJQUFJO1FBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE9BQU8sQ0FBQyxRQUFRO1FBQ1osTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEVBQUMsVUFBQSxRQUFRLEVBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7QUFDTCxDQUFDO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxZQUFZLENBQUMifQ==