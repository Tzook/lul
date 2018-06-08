
// External dependencies
let 	express 		= require('express'),
		http			= require('http'),
		mongoose 		= require('mongoose'),
		session			= require('express-session'),
		MongoStore 		= require('connect-mongo')(session),
		cookieParser	= require('cookie-parser'),
		bodyParser		= require('body-parser'),
		cors			= require('cors'),
		compression		= require('compression');

// Internal
import Bootstrap from './bootstrap';
import { setLogger } from './logger';
import { getController } from './bootstrap';
import Response from '../master/master.response';
import { isSecure, getEnvVariable, isLocal } from './env';

export default class Main {
	private app;

	constructor() {
        this.app = express();
    }

	useDb() {
		mongoose.Promise = global.Promise;
		mongoose.connect(getEnvVariable("dbUrl"));
		mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
	}

	useDependencies() {
		this.app.use(compression({level: 1}));
		this.app.use(cookieParser());
		this.app.use(bodyParser.json());
		this.app.use(cors());
	}

    redirectIfNotSecure() {
        if (!isLocal()) {
            this.app.use((req, res, next) => {
                if (isSecure(req)) {
                    // request was via https, so do no special handling
                    next();
                } else {
                    // request was via http, so redirect to https
                    res.redirect('https://' + req.headers.host + req.url);
                }
            });
        }
    }

    listenToErrors() {
        this.app.use((error, req, res, next) => {
            const controller: Response = getController("user");
            controller.sendError(res, error.message, error.tokens);
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
			if (!isLocal()) {
				setLogger(this.app.db.db);
			}
			console.info("\t+*+*+ Connected to mongodb! on MongoLab +*+*+");
			let bootstrap = new Bootstrap(this.app);
			bootstrap.init();
		});
	}
};