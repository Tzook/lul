import SocketioRouterBase from '../socketio/socketio.router.base';
import TalentsMiddleware from './talents.middleware';
import TalentsController from './talents.controller';
import TalentsServices from './talents.services';
import talentsConfig from '../talents/talents.config';
import StatsRouter from '../stats/stats.router';

export default class TalentsRouter extends SocketioRouterBase {
	protected middleware: TalentsMiddleware;
	protected controller: TalentsController;
	protected services: TalentsServices;
	protected statsRouter: StatsRouter;

	init(files, app) {
		this.services = files.services;
		this.statsRouter = files.routers.stats;
		super.init(files, app);
	}

	protected initRoutes(app) {
		app.post(this.ROUTES.GENERATE,
			this.middleware.validateHasSercetKey.bind(this.middleware),
			this.controller.generateTalents.bind(this.controller));
	}
	
    [talentsConfig.SERVER_INNER.GAIN_ABILITY.name] (data, socket: GameSocket) {
		if (!socket.character.talents._doc[data.ability]) {
			socket.character.talents._doc[data.ability] = this.services.getEmptyCharAbility();
		}
	}
	
	[talentsConfig.SERVER_INNER.HURT_MOB.name]({dmg, mob}: {dmg: number, mob: MOB_INSTANCE}, socket: GameSocket) {
		const exp = this.services.getAbilityExp(dmg); // TODO use some formula
		this.emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY_EXP.name, {exp}, socket);
	}
	
	[talentsConfig.SERVER_INNER.GAIN_ABILITY_EXP.name]({exp}: {exp: number}, socket: GameSocket) {
		this.services.markAbilityModified(socket);
		const ability = socket.character.stats.primaryAbility;
		const talent = socket.character.talents._doc[ability];
		talent.exp += exp;
		
		const expNeededToLevel = this.statsRouter.getExp(talent.lvl);
		const shouldLvl = talent.exp >= expNeededToLevel;
		if (shouldLvl) {
			talent.exp = 0;
		}
		socket.emit(talentsConfig.CLIENT_GETS.GAIN_ABILITY_EXP.name, {
			ability,
			exp,
			now: talent.exp
		});
		if (shouldLvl) {
			this.emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY_LVL.name, {}, socket);
		}
	}
	
	[talentsConfig.SERVER_INNER.GAIN_ABILITY_LVL.name]({}, socket: GameSocket) {
		this.services.markAbilityModified(socket);
		const ability = socket.character.stats.primaryAbility;
		const talent = socket.character.talents._doc[ability];
		talent.lvl++;
		socket.emit(talentsConfig.CLIENT_GETS.GAIN_ABILITY_LVL.name, {
			ability,
			lvl: talent.lvl,
		});
		// TODO add perks
	}
};
