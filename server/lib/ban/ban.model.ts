import MasterModel from "../master/master.model";
import { PRIORITY_USER } from "../user/user.model";

const USER_BAN_SCHEMA = {
    banEnd: Date,
    banReason: String,
};

export const PRIORITY_BAN = PRIORITY_USER + 10;

export default class BanModel extends MasterModel {
    get priority() {
        return PRIORITY_BAN;
    }
    
    createModel() {
        this.addToSchema("User", USER_BAN_SCHEMA);
        return Promise.resolve();
    }
};
