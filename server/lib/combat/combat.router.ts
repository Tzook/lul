
import SocketioRouterBase from '../socketio/socketio.router.base';
import CombatMiddleware from './combat.middleware';
import config from '../combat/combat.config';
import mobsConfig from '../mobs/mobs.config';
import TalentsRouter from '../talents/talents.router';
import talentsConfig from '../talents/talents.config';
import statsConfig from '../stats/stats.config';

export default class CombatRouter extends SocketioRouterBase {
	protected middleware: CombatMiddleware;
	protected talentsRouter: TalentsRouter;
	
	init(files, app) {
		this.talentsRouter = files.routers.talents;
		super.init(files, app);
	}

	[config.SERVER_GETS.LOAD_ATTACK.name](data, socket: GameSocket) {
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.LOAD_ATTACK.name, {
			id: socket.character._id,
			ability: socket.character.stats.primaryAbility
		});
	}

	[config.SERVER_GETS.PERFORM_ATTACK.name](data, socket: GameSocket) {
		let load = this.middleware.getValidLoad(data.load);
		socket.lastAttackLoad = load;
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.PERFORM_ATTACK.name, {
			id: socket.character._id,
			ability: socket.character.stats.primaryAbility,
			load
		});
	}

	[config.SERVER_GETS.CHANGE_ABILITY.name](data, socket: GameSocket) {
		let {ability} = data;
		if (!ability) {
			this.sendError(data, socket, "Must send what ability to use");
		} else if (!this.middleware.canChangeAbility(socket, ability)) {
			this.sendError(data, socket, "Character cannot change to this ability");
		} else if (socket.character.stats.primaryAbility === ability) {
			this.sendError(data, socket, "Character already has this ability");
		} else {
			socket.character.stats.primaryAbility = ability;
			socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.CHANGE_ABILITY.name, {
				id: socket.character._id,
				ability: socket.character.stats.primaryAbility,
			});
		}
	}

	[config.SERVER_GETS.USE_ABILITY.name](data, socket: GameSocket) {
		const targetsInArea = data.target_ids || [];
		const targetsHit = socket.getTargetsHit(targetsInArea);

		const talentInfo = this.talentsRouter.getPrimaryTalentInfo(socket);

		const mp = talentInfo.mp;
		if (mp && !socket.currentSpell) {
			if (socket.character.stats.mp.now < mp) {
				return this.sendError(data, socket, "Not enough mana to use the ability");
			}
			this.emitter.emit(statsConfig.SERVER_INNER.USE_MP.name, {mp}, socket);
		}

		if (talentInfo.hitType == talentsConfig.HIT_TYPE_ATTACK) {
			this.emitter.emit(mobsConfig.SERVER_INNER.MOBS_TAKE_DMG.name, {mobs: targetsHit}, socket);		
		} else {
			// TODO support other types of primary abilities
			console.log("Doing a heal!");
		}
	}
};