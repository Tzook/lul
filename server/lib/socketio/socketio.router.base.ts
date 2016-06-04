'use strict';
import MasterRouter from '../master/master.router';

export default class SocketioRouterBase extends MasterRouter {
	protected io: SocketIO.Namespace;
	public CLIENT_GETS;
	public SERVER_GETS;

	init(files, app) {
		super.init(files, app);
		this.io = app.socketio;
		this.CLIENT_GETS = files.config.CLIENT_GETS;
		this.SERVER_GETS = files.config.SERVER_GETS;
	}

	get connection() {
		return 'socketio';
	}
};