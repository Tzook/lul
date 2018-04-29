
import SocketioRouterBase from './socketio.router.base';
import Emitter = require('events');
import MasterRouter from '../master/master.router';
import * as Heroku from 'heroku-client';
import SocketioMiddleware from './socketio.middleware';
import SocketioServices from './socketio.services';
import config from './socketio.config';
require('./socketio.fixer');
import * as passportSocketIo from 'passport.socketio';
import { isProduction, getEnvVariable } from '../main/main';
import { notifyUserAboutError } from './socketio.router.base';
import * as _ from "underscore";

export default class SocketioRouter extends SocketioRouterBase {
	protected middleware: SocketioMiddleware;
	protected services: SocketioServices;
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
		this.services = files.services;
		this.mapRouters(files.routers);
		this.initDependencies(app.mongoStore);
		this.initListeners();
		this.restartServerEvent(app);
	}

	public getConfig(): Config {
		return this.services.getConfig();
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
			if (!isProduction() && socket.request._query.test === 'true') {
				socket.test = true;
			}
			socket.user = socket.client.request.user;
			socket.character = socket.client.request.character;
			if (this.map.has(socket.user._id.toString())) {
				// character already connected! must disconnect
				socket.disconnect();
				return;
			}
			socket.throttles = new Map();
			this.map.set(socket.user._id.toString(), socket);
			this.map.set(socket.character.name, socket);
			this.map.set(socket.character._id.toString(), socket);
			this.map.set(socket.id, socket);

            let emitter = new Emitter.EventEmitter();
            socket.emitter = emitter;
            
			for (let j in this.routers) {
				let router = this.routers[j];
				router.eventEmitter = emitter;
				this.listenToEvents(router, router.SERVER_GETS, [socket, emitter], config.EVENTS_THROTTLE);
				this.listenToEvents(router, router.SERVER_INNER, [emitter], 0);
			}

			console.log('connected', socket.character.name);
			socket.map = this.map;

			for (let j in this.routers) {
				let router = this.routers[j];
				router.onConnected(socket);
			}
		});
	}

	private listenToEvents(router: SocketioRouterBase, events: EVENT[], listeners: {on: (string, Function) => {}}[], defaultThrottle: number) {
		for (let i in events) {
			let event = events[i];
			let routerFn = router[event.name].bind(router);
			for (let j in listeners) {
				listeners[j].on(event.name, (...args) => {
					let socket: GameSocket = args[1];
					if (!socket || (this.fitThrottle(socket, event, defaultThrottle, routerFn) && 
						this.fitBitch(socket, event) && 
						this.fitAlive(socket, event))) {
                            event.log && this.log(args[0], socket, "Event was called", event.name);
						    routerFn.apply(router, args);
					}
				});
			}
		}
	}

	private fitThrottle(socket: GameSocket, event: EVENT, defaultThrottle: number, routerFn: Function): boolean {
		let throttle = event.throttle >= 0 ? event.throttle : defaultThrottle;
		if (throttle && !socket.test) {
			let lastTime = socket.throttles.get(routerFn) || 0;
			let now = Date.now();
			let time = now - lastTime;
			if (time < throttle) {
				console.error('Throttling event!', event.name);
				return false;
			}
			socket.throttles.set(routerFn, now);
		}
		return true;
	}

	private fitBitch(socket: GameSocket, event: EVENT): boolean {			
		if (event.bitch !== undefined) {
			if (event.bitch !== socket.bitch) {
				console.error('Not bitch!', event.name);
				return false;
			}
		}
		return true;
	}

	private fitAlive(socket: GameSocket, event: EVENT): boolean {
		if (event.alive !== undefined) {
			if (event.alive !== socket.alive) {
				console.error('Not alive!', event.name);
				return false;
			}
		}
		return true;
	}


	public onConnected(socket: GameSocket) {
        if (!socket.test) {
            socket.saveTimer = setInterval(() => this.saveUser(socket), config.SAVE_INTERVAL)
        }
	}

	[config.SERVER_GETS.DISCONNECT.name](data, socket: GameSocket) {
		process.nextTick(() => {
			if (!this.map.has(socket.id)) {
				return;
			}
			this.log({}, socket, "Disconnected");
			// automations should not be saved afterwards - we want it to reset every time
			if (!socket.test) {
				clearInterval(socket.saveTimer);
				this.saveUser(socket);
			}
			this.map.delete(socket.user._id.toString());
			this.map.delete(socket.character.name);
			this.map.delete(socket.character._id.toString());
			this.map.delete(socket.id);
		});
	}

    private saveUser(socket: GameSocket) {
        socket.user.save(error => {
			if (error)  {
				this.fatal(socket, error);
			}
		});
    }

	private restartServerEvent(app) {
		let token = getEnvVariable("herokuAuth");
        let heroku = new Heroku({ token });
        
        let restartText = "Restarting server!\n(For an update)";
		
		app.post(this.ROUTES.RESTART, 
			this.middleware.isBoss.bind(this.middleware),
			(req, res) => {
                restartText = "Restarting server!";
                let charName = (<any>_.last(req.user.characters) || {}).name;
                if (charName) {
                    restartText += `\n(Triggered by ${charName})`;
                }
				heroku.delete('/apps/lul/dynos')
                .then(apps => {
                    console.log("Restarting dynos");
                    res.send({data: 'Restarting server.'});	
                })
                .catch(e => {
                    console.error("Had an error restarting lul:", e);
                });
            });
            
		(<any>process).on("SIGTERM", () => notifyUserAboutError(this.io, restartText, true));
		(<any>process).on("exit", () => notifyUserAboutError(this.io, "Restarting server!\n(Had an error)", true));
	}
 };