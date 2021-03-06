
import MasterRouter from '../master/master.router';
import Emitter = require('events');
import { logger } from '../main/logger';
import { notifyUserAboutError } from './socketio.errors';

export default class SocketioRouterBase extends MasterRouter {
	public io: SocketIO.Namespace;
	protected emitter: Emitter.EventEmitter;
	public CLIENT_GETS;
	public SERVER_GETS;
	public SERVER_INNER;

	init(files, app) {
		this.io = app.socketio;
		super.init(files, app);
		this.CLIENT_GETS = files.config.CLIENT_GETS;
		this.SERVER_GETS = files.config.SERVER_GETS || [];
		this.SERVER_INNER = files.config.SERVER_INNER || [];
	}

	public onConnected(socket: GameSocket) {

	}

	set eventEmitter(emitter) {
		this.emitter = emitter;
	}

	getEmitter() {
		return this.emitter;
	}

	get connection() {
		return 'socketio';
	}

    public log(data: any, socket: GameSocket, message: string, event?: string) {
		event = event || this.getEventName();
        logger.info(message, this.getMeta(socket, data, event));
    }

	public sendError(data: any, socket: GameSocket, error: string, emit = true, display = false) {
		const event = this.getEventName();
		logger.warn(error, this.getMeta(socket, data, event));
		emit && notifyUserAboutError(socket, error, display);
	}

	public fatal(to: NodeJS.EventEmitter|GameSocket, error: Error, event?: string) {
		event = event || this.getEventName();
		logger.error(error.toString(), this.getMeta(to, error, event));
		notifyUserAboutError(to, "Restarting server!\nHad an error: " + error.message, true);
	}
	
	private getEventName(): string {
		let event = "";
		try {
			// grab event from stack trace
			event = (new Error()).stack.match(/at (\S+)/g)[2].slice(3).split('.')[1];
		} catch (e) {}
		return event;
	}

	private getMeta(to: NodeJS.EventEmitter|GameSocket, data, event: string) {
		const extraMetadata = typeof (<any>to).character === "undefined" ? {} : {name: (<GameSocket>to).character.name};
		return Object.assign({event}, extraMetadata, data);
	}
};
