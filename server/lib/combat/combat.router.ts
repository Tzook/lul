
import SocketioRouterBase from '../socketio/socketio.router.base';
import CombatMiddleware from './combat.middleware';
import config from '../combat/combat.config';
import mobsConfig from '../mobs/mobs.config';
import TalentsRouter from '../talents/talents.router';
import talentsConfig from '../talents/talents.config';
import statsConfig from '../stats/stats.config';
import CombatServices from './combat.services';

export default class CombatRouter extends SocketioRouterBase {
	protected services: CombatServices;
	protected middleware: CombatMiddleware;
	protected talentsRouter: TalentsRouter;
	
	init(files, app) {
		this.services = files.services;
		this.talentsRouter = files.routers.talents;
		super.init(files, app);
	}

	public calculateDamage(socket: GameSocket, target: GameSocket|MOB_INSTANCE): DMG_RESULT {
		return this.services.calculateDamage(socket, target);
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
			const previousAbility = socket.character.stats.primaryAbility;
			socket.character.stats.primaryAbility = ability;
			this.emitter.emit(config.SERVER_INNER.CHANGED_ABILITY.name, {previousAbility, ability}, socket);
		}
	}

	[config.SERVER_INNER.CHANGED_ABILITY.name](data, socket: GameSocket) {
		let {ability} = data;
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.CHANGE_ABILITY.name, {
			id: socket.character._id,
			ability,
		});
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
			this.emitter.emit(config.SERVER_INNER.HEAL_CHARS.name, {charNames: targetsHit}, socket);		
		}
	}

	[config.SERVER_INNER.HEAL_CHARS.name](data, socket: GameSocket) {
		const {charNames} = data;

		let cause = config.HIT_CAUSE.HEAL;
		for (let i = 0; i < charNames.length; i++) {
			const charName = charNames[i];
			const healedSocket = socket.map.get(charName);
			if (!healedSocket || !healedSocket.connected) {
				this.sendError({charName}, socket, "No such char id");
			} else if (healedSocket.character.room !== socket.character.room) {
				this.sendError({charName}, socket, "Cannot heal someone in a different room");
			} else if (!healedSocket.alive) {
				this.sendError({charName}, socket, "Cannot heal dead people. You ain't jesus");
			} else {
				const dmgResult = this.calculateDamage(socket, healedSocket);
				this.emitter.emit(config.SERVER_INNER.HEAL_CHAR.name, {
					healedSocket,
					cause,
					dmg: dmgResult.dmg,
					crit: dmgResult.crit
				}, socket);
			}
			cause = config.HIT_CAUSE.AOE;
		}
	}
	
	[config.SERVER_INNER.HEAL_CHAR.name](data, socket: GameSocket) {
		let {healedSocket, dmg, crit} = data;
		
		this.emitter.emit(statsConfig.SERVER_INNER.GAIN_HP.name, { 
			hp: dmg, 
			crit,
		}, healedSocket);
	}
};