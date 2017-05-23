'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import QuestsMiddleware from "./quests.middleware";
import QuestsController from "./quests.controller";
// let SERVER_GETS		   = require('../../../server/lib/quests/quests.config.json').SERVER_GETS;

export default class QuestsRouter extends SocketioRouterBase {
	
    protected middleware: QuestsMiddleware;
	protected controller: QuestsController;

	protected initRoutes(app) {
		app.post(this.ROUTES.GENERATE,
			this.middleware.validateHasSercetKey.bind(this.middleware),
			this.controller.generateQuests.bind(this.controller));
	}
};
