'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
let express = require('express'), http = require('http'), mongoose = require('mongoose'), session = require('express-session'), MongoStore = require('connect-mongo')(session), cookieParser = require('cookie-parser'), bodyParser = require('body-parser'), cors = require('cors'), compression = require('compression');
const bootstrap_1 = require("./bootstrap");
class Main {
    constructor() {
        this.app = express();
    }
    useDb() {
        mongoose.Promise = global.Promise;
        mongoose.connect(process.env.dbUrl ? process.env.dbUrl : require('../../../config/.env.json').dbUrl);
        mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    }
    useDependencies() {
        this.app.dependencies = [
            compression({ level: 1 }),
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
                (err && next(err)) || (!--count && next());
            }
        });
    }
    beginServer() {
        this.app.set('view engine', 'jade');
        this.app.set('port', (process.env.PORT || 5000));
        this.app.server = http.createServer(this.app).listen(this.app.get('port'));
        this.app.socketio = require('socket.io')(this.app.server);
    }
    attachAppVariables() {
        this.app.cookieParser = cookieParser;
        this.app.session = session;
        this.app.db = mongoose.connection;
        this.app.mongoStore = new MongoStore({ mongooseConnection: this.app.db });
    }
    connectToDbAndBootstrap() {
        this.app.db.once('open', () => {
            console.info("\t+*+*+ Connected to mongodb! on MongoLab +*+*+");
            let bootstrap = new bootstrap_1.default(this.app);
            bootstrap.init();
        });
    }
}
exports.default = Main;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvbWFpbi9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFFYixJQUFLLE9BQU8sR0FBSyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQ2pDLElBQUksR0FBSyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQ3hCLFFBQVEsR0FBSyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQ2hDLE9BQU8sR0FBSyxPQUFPLENBQUMsaUJBQWlCLENBQUMsRUFDdEMsVUFBVSxHQUFLLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFDaEQsWUFBWSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsRUFDdkMsVUFBVSxHQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFDcEMsSUFBSSxHQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFDeEIsV0FBVyxHQUFJLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUd4QywyQ0FBb0M7QUFFcEM7SUFHQztRQUNPLElBQUksQ0FBQyxHQUFHLEdBQUcsT0FBTyxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUVKLEtBQUs7UUFDSixRQUFRLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDbEMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyRyxRQUFRLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLG1CQUFtQixDQUFDLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRUQsZUFBZTtRQUdkLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxH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