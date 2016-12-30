'use strict';
import MasterRouter from '../master/master.router';
import Emitter = require('events');

export default class SocketioRouterBase extends MasterRouter {
	protected io: SocketIO.Namespace;
	protected emitter: Emitter.EventEmitter;
	public CLIENT_GETS;
	public SERVER_GETS;

	init(files, app) {
		super.init(files, app);
		this.io = app.socketio;
		this.CLIENT_GETS = files.config.CLIENT_GETS;
		this.SERVER_GETS = files.config.SERVER_GETS;
	}

	set eventEmitter(emitter) {
		this.emitter = emitter;
	}

	get connection() {
		return 'socketio';
	}
};