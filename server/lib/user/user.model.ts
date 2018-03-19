
import MasterModel from '../master/master.model';

export const PRIORITY_USER = 0;

export default class UserModel extends MasterModel {

    init(files, app) {
        this.schema = {
            username: String,
            password: String
        };
        this.params.versionKey = false;
        this.listenForSchemaAddition('User');
    }

    get priority() {
        return PRIORITY_USER;
    }

    createModel() {
        this.setModel('User');
        
        // uncomment this IN LOCAL ONLY to run a modification on all characters, like schema changes
        // this.getModel().find({})
        //     .then((users: User[]) => {
        //         for (let i = 0; i < users.length; i++) {
        //             let user = users[i];
        //             for (let j = 0; j < user.characters.length; j++) {
        //                 let char = user.characters[j];

        //             }
        //             user.save();
        //         }
        //     });

        this.removeListen('User');
        return Promise.resolve();
    }
};