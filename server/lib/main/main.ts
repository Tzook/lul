'use strict';
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
import Logger from './logger';
let config = require('../../../config/config.database.json');

export default class Main {
	private app;

	constructor() {
        this.app = express();
    }

	useDb() {
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

	useDependencies() {
		// Run all async - they don't need to run after each other.
		// To add a dependency to run with them, simply push it to the dependencies array
		this.app.dependencies = [
			compression({lever: 1}),
			cookieParser(),
			bodyParser.json(),
			cors()
		];
		this.app.use((req, res, next) => {
			let count = this.app.dependencies.length;
			for (let i in this.app.dependencies) {
				this.app.dependencies[i](req, res, done);
			}
			function done (err) {
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
		this.app.mongoStore = new MongoStore({ mongooseConnection: this.app.db});
	}

	connectToDbAndBootstrap() {
		this.app.db.once('open', () => {
			console.log("\t+*+*+ Connected to mongodb! on MongoLab +*+*+");
		});
		// TODO move it inside the db.once
		let bootstrap = new Bootstrap(this.app);
		bootstrap.init(this.app);
	}
};