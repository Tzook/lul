import SocketioRouterBase from '../socketio/socketio.router.base';
import { isBoss } from '../master/master.middleware';
import dungeonConfig from './dungeon.config';
import DungeonController from './dungeon.controller';

export default class DungeonRouter extends SocketioRouterBase {
    protected controller: DungeonController;

	protected initRoutes(app) {
		app.post(dungeonConfig.ROUTES.GENERATE,
			isBoss,
			this.controller.generateDungeons.bind(this.controller));
	}
}