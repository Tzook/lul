'use strict';
let MasterController = require('../master/master.controller.js');

/**
 * Character's Controller
 */
class CharacterController extends MasterController {	
	
    /**
     * Tries to register a character to database 
     */
    handleNewCharacter(req, res, next) {
        return this.services.saveNewCharacter(req.user, req.body)
        .then(d => {
            this.sendData(res, this.LOGS.CHARACTER_CREATED_SUCCESSFULLY, req.user);
        })
        .catch(e => {
            this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "handleNewCharacter", file: "character.controller.js"});
        });
    }
}

module.exports = CharacterController;