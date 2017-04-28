'use strict';
import SocketioRouterBase from './socketio.router.base';
import Emitter = require('events');
import MasterRouter from "../master/master.router";
import * as Heroku from 'heroku-client';
import SocketioMiddleware from './socketio.middleware';
require('./socketio.fixer');
let passportSocketIo = require('passport.socketio');
let SERVER_GETS = require('../../../server/lib/socketio/socketio.config.json').SERVER_GETS;

export default class SocketioRouter extends SocketioRouterBase {
	protected middleware: SocketioMiddleware;
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
		this.mapRouters(files.routers);
		this.initDependencies(app.mongoStore);
		this.initListeners();
		this.restartServerEvent(app);
	}

	private mapRouters(routers: MasterRouter[]) {
		for (let i in routers) {
			if (routers[i].connection === "socketio") {
				this.routers.push(<SocketioRouterBase>routers[i]);
			}
		}
	}

	initDependencies(mongoStore) {
		this.io.use((socket: GameSocket, next: Function) => {
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
		for (let i = 0; i < req.user.characters.length; i++) {
			if (req.user.characters[i]._id.equals(req._query.id)) {
				req.character = req.user.characters[i];
				break;
			}
		}
		if (!req.character) {
			let errorMessage = 'no character param OR no such character in user, param was' + req._query.id;
			console.error(errorMessage);
			next(new Error(errorMessage));
		} else if (this.map.has(req.user._id.toString())) {
			let errorMessage = `Users character is already logged in: ${req._query.id}~`;
			console.error(errorMessage);
			next(new Error(errorMessage));
		} else {
			next();
		}
	}
	onAuthorizeFail(req, message, error, next) {
		let errorMessage = 'Error occured trying to connect to user: ' + message;
		console.error(errorMessage);
		next(new Error(errorMessage));
	}

	initListeners() {
		this.io.on(this.ROUTES.BEGIN_CONNECTION, (socket: GameSocket) => {
			socket.user = socket.client.request.user;
			socket.character = socket.client.request.character;
			if (this.map.has(socket.user._id.toString())) {
				// character already connected! must disconnect
				socket.disconnect();
				return;
			}
			this.map.set(socket.user._id.toString(), socket);
			this.map.set(socket.character.name, socket);
			this.map.set(socket.id, socket);

			let emitter = new Emitter.EventEmitter();
			for (let j in this.routers) {
				let router = this.routers[j];
				router.eventEmitter = emitter;
				this.listenToEvents(router, router.SERVER_GETS, [socket, emitter]);
				this.listenToEvents(router, router.SERVER_INNER, [emitter]);
			}

			console.log('connected', socket.character.name);
			socket.map = this.map;

			for (let j in this.routers) {
				let router = this.routers[j];
				router.onConnected(socket);
			}
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
		if (!this.map.has(socket.id)) {
			return;
		}
		console.log('disconnected', socket.character.name);
		socket.user.save(e => {
			if (e) {
				console.error(e);
			}
		});
		this.map.delete(socket.user._id.toString());
		this.map.delete(socket.character.name);
		this.map.delete(socket.id);
	}

	private restartServerEvent(app) {
		let token = process.env.herokuAuth ? process.env.herokuAuth : require('../../../config/.env.json').herokuAuth;
		let heroku = new Heroku({ token });
		
		app.post(this.ROUTES.RESTART, 
			this.middleware.validateHasSercetKey.bind(this.middleware),
			(req, res) => {
				heroku.delete('/apps/lul/dynos')
					.then(apps => {
						console.log("Restarting dynos");
						res.send({data: 'Restarting server.'});	
					})
					.catch(e => {
						console.error("Had an error restarting lul:", e);
					});
		});
	}
};