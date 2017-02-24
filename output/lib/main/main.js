'use strict';
// External dependencies
let express = require('express'), http = require('http'), mongoose = require('mongoose'), session = require('express-session'), MongoStore = require('connect-mongo')(session), cookieParser = require('cookie-parser'), bodyParser = require('body-parser'), cors = require('cors'), compression = require('compression');
// Internal
const bootstrap_1 = require("./bootstrap");
const logger_1 = require("./logger");
class Main {
    constructor() {
        this.app = express();
    }
    useDb() {
        mongoose.connect(process.env.dbUrl ? process.env.dbUrl : require('../../../config/config.database.json').dbUrl);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvbWFpbi9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLHdCQUF3QjtBQUN4QixJQUFLLE9BQU8sR0FBSyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQ2pDLElBQUksR0FBSyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ3hCLFFBQVEsR0FBSyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQ2hDLE9BQU8sR0FBSyxPQUFPLENBQUMsaUJBQWlCLENBQUMsRUFDdEMsVUFBVSxHQUFLLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFDaEQsWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFDdkMsVUFBVSxHQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFDcEMsSUFBSSxHQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFDeEIsV0FBVyxHQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUV4QyxXQUFXO0FBQ1gsMkNBQW9DO0FBQ3BDLHFDQUE4QjtBQUU5QjtJQUdDO1FBQ08sSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUosS0FBSztRQUNKLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLHNDQUFzQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEgsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVELFNBQVM7UUFDUixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLGdC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