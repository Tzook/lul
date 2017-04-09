'use strict';
let config = require('../../../server/lib/master/master.config.json');
const STATUS_CODES = config.STATUS_CODES;

export default class Response {
    protected services;
    protected LOGS;

    init(files, app) {
		this.services = files.services;
		this.LOGS = files.config.LOGS;
        for (var i in config.LOGS) { // merge MASTER logs into the instance logs
            this.LOGS[i] = config.LOGS[i];
        }
    }

    sendError(res, ERROR, tokens?) {
        return this.services.replaceTokens(ERROR.MSG, tokens)
        .then(error => {
            console.error("Sending an error:", error);
            res.status(STATUS_CODES[ERROR.STATUS]).send({code: ERROR.CODE, error});
        });
    }

    sendData(res, SUCCESS, data?) {
        let body:any = {code: SUCCESS.CODE, msg: SUCCESS.MSG};
        data && (body.data = data);
        console.info("Sending body", body);
        res.status(STATUS_CODES[SUCCESS.STATUS]).send(body);
    }
};