'use strict';
import MasterServices from '../master/master.services';

export default class UserServices extends MasterServices {

    saveNewUser(body) {
        return this.Q.ninvoke(new this.Model(body), 'save');
    }

    deleteUser(id) {
        return this.Model.findByIdAndRemove(id);
    }

    getUser(username) {
        return this.Q.ninvoke(this.Model, 'findOne', {username});
    }
};