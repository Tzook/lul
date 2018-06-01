import MasterController from '../master/master.controller';
import { getCharacterUser } from '../character/character.services';
import { banUser, unbanUser } from './ban.services';
import banConfig from './ban.config';

export default class BanController extends MasterController {
    public banUser(req, res, next) {
        getCharacterUser(req.body.char_name)
            .then(user => {
                const now = new Date();
                const date = new Date(now.setFullYear(now.getFullYear() + 1000));
                banUser(user, date, req.body.reason);
                return user.save();
            })
            .then(() => {
                this.sendData(res, banConfig.LOGS.USER_BANNED_SUCCESSFULLY);
            })
            .catch(e => {
                this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "banUser", file: "ban.controller.js"});
            });
    }

    public unbanUser(req, res, next) {
        getCharacterUser(req.body.char_name)
            .then(user => {
                unbanUser(user);
                return user.save();
            })
            .then(() => {
                this.sendData(res, banConfig.LOGS.USER_UNBANNED_SUCCESSFULLY);
            })
            .catch(e => {
                this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "banUser", file: "ban.controller.js"});
            });
    }
};