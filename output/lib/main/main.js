'use strict';
// External dependencies
let express = require('express'), http = require('http'), mongoose = require('mongoose'), session = require('express-session'), MongoStore = require('connect-mongo')(session), cookieParser = require('cookie-parser'), bodyParser = require('body-parser'), cors = require('cors'), compression = require('compression');
// Internal
const bootstrap_1 = require('./bootstrap');
const logger_1 = require('./logger');
let config = require('../../../config/config.database.json');
class Main {
    constructor() {
        this.app = express();
    }
    useDb() {
        mongoose.connect(config.dbUrl);
        mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    }
    useLogger() {
        this.app.logger = new logger_1.default();
        this.app.use((req, res, next) => {
            this.app.logger.info(req, 'begin request!');
            next();
        });
    }
    useDependencies() {
        // Run all async - they don't need to run after each other.
        // To add a dependency to run with them, simply push it to the dependencies array
        this.app.dependencies = [
            compression({ lever: 1 }),
            cookieParser(),
            bodyParser.json(),
            cors()
        ];
        this.app.use((req, res, next) => {
            let count = this.app.dependencies.length;
            for (let i in this.app.dependencies) {
                this.app.dependencies[i](req, res, done);
            }
            function done(err) {
                (err && next(err)) || (!--count && next()); // if had error - next will handle it. otherwise, when all finished, procceed.
            }
        });
    }
    beginServer() {
        this.app.set('view engine', 'jade');
        this.app.set('port', (process.env.PORT || 5000));
        this.app.server = http.createServer(this.app).listen(this.app.get('port'));
        this.app.socketio = require('socket.io')(this.app.server);
        console.log("\t+*+*+ New server on localhost:" + this.app.get('port') + " +*+*+");
    }
    attachAppVariables() {
        this.app.cookieParser = cookieParser;
        this.app.session = session;
        this.app.db = mongoose.connection;
        this.app.mongoStore = new MongoStore({ mongooseConnection: this.app.db });
    }
    connectToDbAndBootstrap() {
        this.app.db.once('open', () => {
            console.log("\t+*+*+ Connected to mongodb! on MongoLab +*+*+");
        });
        // TODO move it inside the db.once
        let bootstrap = new bootstrap_1.default(this.app);
        bootstrap.init(this.app);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Main;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvbWFpbi9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLHdCQUF3QjtBQUN4QixJQUFLLE9BQU8sR0FBSyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQ2pDLElBQUksR0FBSyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ3hCLFFBQVEsR0FBSyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQ2hDLE9BQU8sR0FBSyxPQUFPLENBQUMsaUJBQWlCLENBQUMsRUFDdEMsVUFBVSxHQUFLLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFDaEQsWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFDdkMsVUFBVSxHQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFDcEMsSUFBSSxHQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFDeEIsV0FBVyxHQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUV4QyxXQUFXO0FBQ1gsNEJBQXNCLGFBQWEsQ0FBQyxDQUFBO0FBQ3BDLHlCQUFtQixVQUFVLENBQUMsQ0FBQTtBQUM5QixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQztBQUU3RDtJQUdDO1FBQ08sSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUosS0FBSztRQUNKLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLFFBQVEsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFFRCxTQUFTO1FBQ1IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQkFBTSxFQUFFLENBQUM7UUFDL0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7WUFDM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzVDLElBQUksRUFBRSxDQUFDO1FBQ1IsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsZUFBZTtRQUNkLDJEQUEyRDtRQUMzRCxpRkFBaUY7UUFDakYsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUc7WUFDdkIsV0FBVyxDQUFDLEVBQUMsS0FBSyxFQUFFLENBQUMsRUFBQyxDQUFDO1lBQ3ZCLFlBQVksRUFBRTtZQUNkLFVBQVUsQ0FBQyxJQUFJLEVBQUU7WUFDakIsSUFBSSxFQUFFO1NBQ04sQ0FBQztRQUNGLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJO1lBQzNCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztZQUN6QyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUMsQ0FBQztZQUNELGNBQWUsR0FBRztnQkFDakIsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyw4RUFBOEU7WUFDM0gsQ0FBQztRQUNGLENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVELFdBQVc7UUFDVixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDcEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUMzRSxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUxRCxPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDO0lBQ25GLENBQUM7SUFFRCxrQkFBa0I7UUFDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1FBQ3JDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUMzQixJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsVUFBVSxDQUFDO1FBQ2xDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksVUFBVSxDQUFDLEVBQUUsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRCx1QkFBdUI7UUFDdEIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7UUFDaEUsQ0FBQyxDQUFDLENBQUM7UUFDSCxrQ0FBa0M7UUFDbEMsSUFBSSxTQUFTLEdBQUcsSUFBSSxtQkFBUyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMxQixDQUFDO0FBQ0YsQ0FBQztBQWhFRDtzQkFnRUMsQ0FBQTtBQUFBLENBQUMifQ==