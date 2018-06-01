import MasterRouter from '../master/master.router';
import banConfig from './ban.config';
import { isBoss } from '../master/master.middleware';
import BanController from './ban.controller';

export default class BanRouter extends MasterRouter {
	protected controller: BanController;

	protected initRoutes(app) {
		app.post(banConfig.ROUTES.BAN,
			isBoss,
			this.controller.banUser.bind(this.controller));

		app.post(banConfig.ROUTES.UNBAN,
			isBoss,
			this.controller.unbanUser.bind(this.controller));
	}
}