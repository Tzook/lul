'use strict';
const config = require('../../../server/lib/master/master.config.json');
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
        for (var i in config.LOGS) {
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
            res.status(STATUS_CODES[ERROR.STATUS]).send({ code: ERROR.CODE, error: error });
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
        let body = { code: SUCCESS.CODE, msg: SUCCESS.MSG };
        data && (body.data = data);
        res.status(STATUS_CODES[SUCCESS.STATUS]).send(body);
    }
}
;
module.exports = Response;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzdGVyLnJlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9tYXN0ZXIvbWFzdGVyLnJlc3BvbnNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO0FBQ3hFLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFFekM7O0dBRUc7QUFDSDtJQUNJOztPQUVHO0lBQ0gsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ3hCLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsQyxDQUFDO0lBQ0wsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILFNBQVMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU07UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDO2FBQ3BELElBQUksQ0FBQyxLQUFLO1lBQ1AsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsT0FBQSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQzNFLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7Ozs7T0FNRztJQUNILFFBQVEsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUk7UUFDdkIsSUFBSSxJQUFJLEdBQUcsRUFBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBQyxDQUFDO1FBQ2xELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDM0IsR0FBRyxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hELENBQUM7QUFDTCxDQUFDO0FBQUEsQ0FBQztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDIn0=