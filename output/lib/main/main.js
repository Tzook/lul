'use strict';
// External dependencies
let express = require('express'), http = require('http'), mongoose = require('mongoose'), session = require('express-session'), MongoStore = require('connect-mongo')(session), cookieParser = require('cookie-parser'), bodyParser = require('body-parser'), cors = require('cors'), compression = require('compression');
// Internal
let Bootstrap = require('./bootstrap.js'), Logger = require('./logger.js'), config = require('../../../config/config.database.json');
/**
 * Main of the app
 * @namespace
 * @property {'express'.Express} app
 */
class Main {
    /**
     * Default constructor
     */
    constructor() {
        this.app = express();
    }
    useDb() {
        //Setting up the db
        mongoose.connect(config.dbUrl);
        mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    }
    useLogger() {
        this.app.logger = new Logger();
        this.app.use((req, res, next) => {
            this.app.logger.info(req, 'begin request!');
            next();
        });
    }
    /**
     * Sets the dependencies of the app
     */
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
    /**
     * Listens to the port, and instantiates the routes of the app
     */
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
        let bootstrap = new Bootstrap(this.app);
        bootstrap.init(this.app);
    }
}
;
module.exports = Main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvbWFpbi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLHdCQUF3QjtBQUN4QixJQUFLLE9BQU8sR0FBSyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQ2pDLElBQUksR0FBSyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ3hCLFFBQVEsR0FBSyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQ2hDLE9BQU8sR0FBSyxPQUFPLENBQUMsaUJBQWlCLENBQUMsRUFDdEMsVUFBVSxHQUFLLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFDaEQsWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFDdkMsVUFBVSxHQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFDcEMsSUFBSSxHQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFDeEIsV0FBVyxHQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUV4QyxXQUFXO0FBQ1gsSUFBSyxTQUFTLEdBQUssT0FBTyxDQUFDLGdCQUFnQixDQUFDLEVBQzFDLE1BQU0sR0FBSyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQ2pDLE1BQU0sR0FBSyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQztBQUU3RDs7OztHQUlHO0FBQ0g7SUFDQzs7T0FFRztJQUNIO1FBQ08sSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUosS0FBSztRQUNKLG1CQUFtQjtRQUNuQixRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUMvQixRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLG1CQUFtQixDQUFDLENBQUMsQ0FBQztJQUNuRixD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