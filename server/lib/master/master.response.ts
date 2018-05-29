
import config from '../master/master.config';
const STATUS_CODES = config.STATUS_CODES;

export default class Response {
    protected services;
    protected LOGS;

    init(files, app) {
		this.services = files.services;
		this.LOGS = Object.assign({}, files.config.LOGS, config.LOGS); // merge MASTER logs into the instance logs
    }

    public sendError(res, ERROR, tokens?) {
        return this.services.replaceTokens(ERROR.MSG, tokens)
        .then(error => {
            console.error("Sending an error:", error);
            sendErrorResponse(res, Object.assign({}, ERROR, {error}));
        });
    }
    
    protected sendData(res, SUCCESS, data?) {
        let body:any = {code: SUCCESS.CODE, msg: SUCCESS.MSG};
        data && (body.data = data);
        console.info("Sending body", body);
        res.status(STATUS_CODES[SUCCESS.STATUS]).send(body);
    }
};

export function sendErrorResponse(res, ERROR) {
    res.status(STATUS_CODES[ERROR.STATUS]).send({code: ERROR.CODE, error: ERROR.MSG});
}