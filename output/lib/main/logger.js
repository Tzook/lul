'use strict';
let winston = require('winston');
class Logger {
    constructor() {
        this.logger = new winston.Logger({
            transports: [
                new (winston.transports.File)({
                    name: 'info file',
                    filename: 'server/logs.log',
                    level: 'info'
                }),
                new (winston.transports.File)({
                    name: 'error file',
                    filename: 'server/logs.log',
                    level: 'error'
                })
            ]
        });
    }
    getMetaData(req) {
        return {
            url: req.url,
            method: req.method,
            user: req.user && req.user.username
        };
    }
    info(req, msg) {
        this.logger.info(msg, this.getMetaData(req));
    }
    error(req, msg) {
        this.logger.error(msg, this.getMetaData(req));
    }
}
module.exports = Logger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9tYWluL2xvZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFDYixJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFakM7SUFDQztRQUNDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFFO1lBQ2pDLFVBQVUsRUFBRTtnQkFDWCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBRTtvQkFDOUIsSUFBSSxFQUFFLFdBQVc7b0JBQ2pCLFFBQVEsRUFBRSxpQkFBaUI7b0JBQzNCLEtBQUssRUFBRSxNQUFNO2lCQUNiLENBQUM7Z0JBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUU7b0JBQzlCLElBQUksRUFBRSxZQUFZO29CQUNsQixRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixLQUFLLEVBQUUsT0FBTztpQkFDZCxDQUFDO2FBQ0Y7U0FDRCxDQUFDLENBQUM7SUFDSixDQUFDO0lBQ0QsV0FBVyxDQUFDLEdBQUc7UUFDZCxNQUFNLENBQUM7WUFDTixHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUc7WUFDWixNQUFNLEVBQUUsR0FBRyxDQUFDLE1BQU07WUFDbEIsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRO1NBQ25DLENBQUM7SUFDSCxDQUFDO0lBQ0QsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHO1FBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHO1FBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUMvQyxDQUFDO0FBQ0YsQ0FBQztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDIn0=