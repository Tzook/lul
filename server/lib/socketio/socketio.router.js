'use strict';
require('./socketio.fixer.js');
let passportSocketIo = require('passport.socketio');
let RouterBase		 = require('../master/master.router.js');
let SERVER_GETS		 = require('./socketio.config.json').SERVER_GETS;

/**
 * Socketio's router
 */
class SocketioRouter extends RouterBase {
	constructor() {
		super();
		this.routers = [this];
		this.map = new Map();
		this.pos = {};
	}
	
	/**
	 * Initializes the instance
	 */
	init(files, app) {
		super.init(files, app);
		this.CLIENT_GETS = files.config.CLIENT_GETS;
		this.SERVER_GETS = files.config.SERVER_GETS;
		this.io = app.socketio;
		this.initDependencies(app.mongoStore);
		this.initListeners();
	}
	
	initDependencies(mongoStore) {
		this.io.use((socket, next) => {
			this.logger.info(socket.request, 'begin socket');
			if (socket.request._query.unicorn) {
				socket.request._query.session_id = socket.request._query.unicorn.split(/s:|\./)[1];
			}
			next();
		});
		this.io.use(passportSocketIo.authorize({
				key:          'unicorn',
				secret:       'UnicornsAreAmazingB0ss',  
				store:        mongoStore,
				success:      this.onAuthorizeSuccess.bind(this),
				fail:         this.onAuthorizeFail.bind(this),
		}));
	}
	onAuthorizeSuccess(req, next) {
		this.logger.info(req, 'logged user successfully');
		// TODO move to service
		for (let i in req.user.characters) {
			if (req.user.characters[i].name === req._query.ch) {
				req.character = req.user.characters[i];
				break;
			}
		}
		if (!req.character) {
			this.logger.error(req, 'no character param OR no such character in user, param was' + req._query.ch);
			console.log("need to have a valid 'ch' param.");
			next(new Error("no character param OR no such character in user. Instead, got: " + req._query.ch));
		} else if (this.map.get(req._query.ch)) {
			this.logger.error(req, `Users character is already logged in: ${req._query.ch}~`);
			console.log(`Character ${req._query.ch} is already logged in.`);
			next(new Error(`Character ${req._query.ch} is already logged in`));
		} else {
			console.log('in success');
			next();
		}
	}
	onAuthorizeFail(req, message, error, next) {
		this.logger.error(req, 'Error occured trying to connect to user: ' + message);
		console.log('in failure');
		next(new Error("Error occured trying to connect to user: " + message));
	}
	
	setConnection(router) {
		this.routers.push(router);
	}
	
	initListeners() {
		this.io.on(this.ROUTES.BEGIN_CONNECTION, socket => {
			socket.user = socket.client.request.user;
			socket.character = socket.client.request.character;
			for (let j in this.routers) {
				let router = this.routers[j];
				for (let i in router.SERVER_GETS) {
					socket.on(router.SERVER_GETS[i], router[router.SERVER_GETS[i]].bind(router));
				}
			}
			console.log('connected');
			socket.broadcast.emit(this.CLIENT_GETS.LOGIN, { ch: socket.character.name, x: socket.character.pos.x, y: socket.character.pos.y });
			socket.emit(this.CLIENT_GETS.YOYO, {loggedIn: this.pos});
			this.map.set(socket.character.name, socket);
			this.pos[socket.character.name] = socket.character.pos;
		});
	}
	
	[SERVER_GETS.YAYA](data, socket) {
		console.log('yaya!');
		socket.emit(this.CLIENT_GETS.TY, { d: 'Thanks brah~!' });
	}
	
	[SERVER_GETS.MSG](data, socket) {
		console.log(data);
		this.io.emit(this.CLIENT_GETS.MSG, {d: data.d, ch: socket.character.name});
	}
	
	[SERVER_GETS.DISCONNECT](data, socket) {
		console.log('disconnect');
		this.io.emit('disconnected', {ch: socket.character.name});
		this.map.delete(socket.character.name);
		delete this.pos[socket.character.name];
	}	
}

module.exports = SocketioRouter;