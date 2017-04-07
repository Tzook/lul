'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.default = Logger;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9tYWluL2xvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRWpDO0lBR0M7UUFDQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBRTtZQUNqQyxVQUFVLEVBQUU7Z0JBQ1gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUU7b0JBQzlCLElBQUksRUFBRSxXQUFXO29CQUNqQixRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixLQUFLLEVBQUUsTUFBTTtpQkFDYixDQUFDO2dCQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFFO29CQUM5QixJQUFJLEVBQUUsWUFBWTtvQkFDbEIsUUFBUSxFQUFFLGlCQUFpQjtvQkFDM0IsS0FBSyxFQUFFLE9BQU87aUJBQ2QsQ0FBQzthQUNGO1NBQ0QsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUNELFdBQVcsQ0FBQyxHQUFHO1FBQ2QsTUFBTSxDQUFDO1lBQ04sR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHO1lBQ1osTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNO1lBQ2xCLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUTtTQUNuQyxDQUFDO0lBQ0gsQ0FBQztJQUNELElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRztRQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFHLEVBQUUsR0FBRztRQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQztDQUNEO0FBakNELHlCQWlDQztBQUFBLENBQUMifQ==