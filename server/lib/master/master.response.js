'use strict';
const config = require('./master.config.json');
const STATUS_CODES = config.STATUS_CODES;

/**
 *  Response class to manage response and status codes
 */
class Response {
    /**
     * Init the instance
     */
    init(files, app) {
		this.services = files.services;
		this.LOGS = files.config.LOGS;
        for (var i in config.LOGS) { // merge MASTER logs into the instance logs
            this.LOGS[i] = config.LOGS[i];
        }
    }
    
    /**
     * A wrapper to send error as a response
     * Replaces any tokens in the message with the tokens. does nothing if there aren't
     * @param {ServerResponse} res
     * @param {Object} ERROR Looks like: {CODE, MSG, STATUS} (from config.response)
     * @param {Object|undefined} tokens In the format: {token_name: "the replacement"}
     */
    sendError(res, ERROR, tokens) {
        return this.services.replaceTokens(ERROR.MSG, tokens)
        .then(error => {
            res.status(STATUS_CODES[ERROR.STATUS]).send({code: ERROR.CODE, error});        
        });
    }
    
    /**
     * A wrapper to send data as a response
     * If there is not data, will send without it
     * @param {ServerResponse} res
     * @param {Object} SUCCESS Looks like: {CODE, MSG, STATUS} (from config.response)
     * @param {Object|undefined} data
     */
    sendData(res, SUCCESS, data) {
        let body = {code: SUCCESS.CODE, msg: SUCCESS.MSG};
        data && (body.data = data);
        res.status(STATUS_CODES[SUCCESS.STATUS]).send(body);
    }
};

module.exports = Response;