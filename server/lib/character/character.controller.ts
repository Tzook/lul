
import MasterController from '../master/master.controller';

export default class CharacterController extends MasterController {

    handleNewCharacter(req, res, next) {
        return this.services.saveNewCharacter(req.user, req.body)
        .then(d => {
            this.sendData(res, this.LOGS.CHARACTER_CREATED_SUCCESSFULLY, req.user.characters);
        })
        .catch(e => {
            this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "handleNewCharacter", file: "character.controller.js"});
        });
    }

    deleteCharacter(req, res, next) {
        this.services.deleteCharacter(req.user, req.body.id)
        .then(d => {
            this.sendData(res, this.LOGS.CHARACTER_DELETED_SUCCESSFULLY, req.user.characters);
        })
        .catch(e => {
            this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "deleteCharacter", file: "character.controller.js"});
        });
    }
};