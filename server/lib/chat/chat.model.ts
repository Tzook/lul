
import MasterModel from '../master/master.model';
import { PRIORITY_USER } from '../user/user.model';

const PRIORITY_BOSS = 5;

export default class ChatModel extends MasterModel {
    get priority() {
        return PRIORITY_USER + PRIORITY_BOSS;
    }

    createModel() {
        this.addToSchema('User', {boss: Boolean});
        return Promise.resolve();
    }
};