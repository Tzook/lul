'use strict';
import MasterRouter from '../master/master.router';
import Emitter = require('events');
let config = require('../../../server/lib/socketio/socketio.config.json');

export default class SocketioRouterBase extends MasterRouter {
	protected io: SocketIO.Namespace;
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

	get connection() {
		return 'socketio';
	}

	protected sendError(data: any, socket: GameSocket, error: string, emit = true) {
		let event = "";
		try {
			// grab event from stack trace
			event = (new Error()).stack.match(/at (\S+)/g)[1].slice(3).split('.')[1];
		} catch (e) {}
		console.error("Sending error to socket %s:", socket.character.name, error, data, event);
		emit && socket.emit(config.CLIENT_GETS.EVENT_ERROR, {
			error,
			data,
			event
		});
	}
};