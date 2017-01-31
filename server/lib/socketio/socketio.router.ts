'use strict';
import SocketioRouterBase from './socketio.router.base';
import Emitter = require('events');
require('./socketio.fixer');
let passportSocketIo = require('passport.socketio');
let SERVER_GETS = require('../../../server/lib/socketio/socketio.config.json').SERVER_GETS;

export default class SocketioRouter extends SocketioRouterBase {
	protected routers: SocketioRouterBase[];
	protected map: Map<string, GameSocket>;

	constructor() {
		super();
		this.routers = [this];
		this.map = new Map();
	}

	/**
	 * Initializes the instance
	 */
	init(files, app) {
		super.init(files, app);
		this.initDependencies(app.mongoStore);
		this.initListeners();
	}

	initDependencies(mongoStore) {
		this.io.use((socket: GameSocket, next: Function) => {
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
	onAuthorizeSuccess(req, next: Function) {
		this.logger.info(req, 'logged user successfully');
		// TODO move to service
		for (let i in req.user.characters) {
			if (req.user.characters[i]._id.equals(req._query.id)) {
				req.character = req.user.characters[i];
				break;
			}
		}
		if (!req.character) {
			this.logger.error(req, 'no character param OR no such character in user, param was' + req._query.id);
			next(new Error("no character param OR no such character in user. Instead, got: " + req._query.id));
		} else if (this.map.get(req._query.id)) {
			this.logger.error(req, `Users character is already logged in: ${req._query.id}~`);
			next(new Error(`Character ${req._query.id} is already logged in`));
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
		this.io.on(this.ROUTES.BEGIN_CONNECTION, (socket: GameSocket) => {
			socket.user = socket.client.request.user;
			socket.character = socket.client.request.character;
			this.map.set(socket.character._id.toString(), socket);
			this.map.set(socket.character.name, socket);
			this.map.set(socket.id, socket);

			let emitter = new Emitter.EventEmitter();
			for (let j in this.routers) {
				let router = this.routers[j];
				router.eventEmitter = emitter;
				this.listenToEvents(router, router.SERVER_GETS, [socket, emitter]);
				this.listenToEvents(router, router.SERVER_INNER, [emitter]);
			}

			console.log('connected');
			socket.map = this.map;

			// TODO remove this
			sendExpToClient(this.emitter, socket);
		});
	}

	private listenToEvents(router: SocketioRouterBase, events: string[], listeners: {on: (string, Function) => {}}[]) {
		for (let i in events) {
			let event = events[i];
			let routerFn = router[event].bind(router);
			for (let j in listeners) {
				listeners[j].on(event, routerFn);
			}
		}
	}

	[SERVER_GETS.DISCONNECT](data, socket: GameSocket) {
		console.log('disconnected from socket');
		socket.user.save(e => {
			if (e) {
				console.error(e);
			}
		});
		this.map.delete(socket.character._id.toString());
		this.map.delete(socket.character.name);
		this.map.delete(socket.id);
	}
};

function sendExpToClient(emitter, socket: GameSocket) {
	if (socket.connected) {
		emitter.emit("gain_exp", { exp: 30 }, socket);
		setTimeout(function() {
			sendExpToClient(emitter, socket);
		}, 5000);
	}
}