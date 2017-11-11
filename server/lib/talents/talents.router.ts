import SocketioRouterBase from '../socketio/socketio.router.base';
import TalentsMiddleware from './talents.middleware';
import TalentsController from './talents.controller';
import TalentsServices from './talents.services';
import statsConfig from '../stats/stats.config';

export default class TalentsRouter extends SocketioRouterBase {
	protected middleware: TalentsMiddleware;
	protected controller: TalentsController;
	protected services: TalentsServices;

	init(files, app) {
		this.services = files.services;
		super.init(files, app);
	}

	protected initRoutes(app) {
		app.post(this.ROUTES.GENERATE,
			this.middleware.validateHasSercetKey.bind(this.middleware),
			this.controller.generateTalents.bind(this.controller));
	}
	
    [statsConfig.SERVER_INNER.GAIN_ABILITY.name] (data, socket: GameSocket) {
		if (!socket.character.talents[data.ability]) {
			socket.character.talents[data.ability] = this.services.getEmptyCharAbility();
		}
    }
};
