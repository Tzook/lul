
import SocketioRouterBase from '../socketio/socketio.router.base';
import CombatMiddleware from './combat.middleware';
import config from '../combat/combat.config';
import mobsConfig from '../mobs/mobs.config';
import TalentsRouter from '../talents/talents.router';
import talentsConfig from '../talents/talents.config';
import statsConfig from '../stats/stats.config';
import CombatServices, { setAttackInfo, popAttackInfo, getDamageDealt, getValidTargets, hasMainAbility, addMainAbility, canSetMainAbility } from './combat.services';
import { getMpUsage, getId, getHp, isMob, isSocket, hasAbility } from '../talents/talents.services';
import { calculateDamage } from './combat.services';
import { didHitMob } from '../mobs/mobs.services';

export default class CombatRouter extends SocketioRouterBase {
	protected services: CombatServices;
	protected middleware: CombatMiddleware;
	protected talentsRouter: TalentsRouter;
	
	init(files, app) {
		this.services = files.services;
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
		const attackId = data.attack_id;
		if (!attackId) {
			return this.sendError(data, socket, "Must include an attack id");
		}

		let {mp} = this.talentsRouter.getPrimaryTalentInfo(socket);
		if (mp) {
			mp = getMpUsage(mp, socket);
			if (socket.character.stats.mp.now < mp) {
				return this.sendError(data, socket, "Not enough mana to use the ability");
			}
			this.emitter.emit(statsConfig.SERVER_INNER.USE_MP.name, {mp}, socket);
		}

		let load = this.middleware.getValidLoad(data.load);
		setAttackInfo(socket, attackId, load);
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.PERFORM_ATTACK.name, {
			id: socket.character._id,
			ability: socket.character.stats.primaryAbility,
			load
		});
	}

	[config.SERVER_GETS.CHANGE_ABILITY.name](data, socket: GameSocket) {
		let {ability} = data;
		if (!ability) {
			return this.sendError(data, socket, "Must send what ability to use");
		} else if (!this.middleware.canChangeAbility(socket, ability)) {
			return this.sendError(data, socket, "Character cannot change to this ability");
		} else if (socket.character.stats.primaryAbility === ability) {
			return this.sendError(data, socket, "Character already has this ability");
		}
		const previousAbility = socket.character.stats.primaryAbility;
		socket.character.stats.primaryAbility = ability;
		this.emitter.emit(config.SERVER_INNER.CHANGED_ABILITY.name, {previousAbility, ability}, socket);
	}
	
	[config.SERVER_INNER.CHANGED_ABILITY.name](data, socket: GameSocket) {
		let {ability} = data;
		socket.broadcast.to(socket.character.room).emit(this.CLIENT_GETS.CHANGE_ABILITY.name, {
			id: socket.character._id,
			ability,
		});
	}
	
	[config.SERVER_GETS.SELECT_MAIN_ABILITY.name](data, socket: GameSocket) {
		let {ability} = data;
		if (!ability) {
			return this.sendError(data, socket, "Must send what ability to main");
		} else if (!hasAbility(socket, ability)) {
			return this.sendError(data, socket, "Character doesn't have that ability");
		} else if (hasMainAbility(socket, ability)) {
			return this.sendError(data, socket, "Ability is already mained");
		} else if (!canSetMainAbility(socket)) {
			return this.sendError(data, socket, "Cannot main abilities in that room");
		}
		addMainAbility(socket, ability);
	}

	[config.SERVER_GETS.USE_ABILITY.name](data, socket: GameSocket) {
		const {target_ids, attack_id} = data;
		const attackInfo = popAttackInfo(socket, attack_id);
		if (!attackInfo) {
			return this.sendError(data, socket, "Attack must be performed before it is used");
		}
		
		this.emitter.emit(config.SERVER_INNER.ACTIVATE_ABILITY.name, {target_ids, attackInfo}, socket);
	}

	[config.SERVER_INNER.ACTIVATE_ABILITY.name](data: {target_ids, attackInfo: ATTACK_INFO, cause?: string}, socket: GameSocket) {
		const {attackInfo, target_ids: targetsInArea = [], cause} = data;
		const targetsHit = socket.getTargetsHit(targetsInArea);

		const {hitType} = this.talentsRouter.getAbilityInfo(attackInfo.ability);

		const previousAbility = socket.character.stats.primaryAbility;
		socket.character.stats.primaryAbility = attackInfo.ability;
		socket.lastAttackLoad = attackInfo.load;

		if (hitType == talentsConfig.HIT_TYPE_ATTACK) {
			this.emitter.emit(config.SERVER_INNER.ATK_TARGETS.name, {attacker: socket, target_ids: targetsHit, cause}, socket);		
		} else {
			this.emitter.emit(config.SERVER_INNER.HEAL_CHARS.name, {charIds: targetsHit}, socket);		
		}

		socket.character.stats.primaryAbility = previousAbility;
	}

	[config.SERVER_INNER.ATK_TARGETS.name](data: {attacker: PLAYER, target_ids: string[], cause?: string}, socket: GameSocket) {
		let {attacker, target_ids, cause = config.HIT_CAUSE.ATK} = data;

		const targets = getValidTargets(socket, target_ids);
		
		for (let target of targets) {
			if (isSocket(attacker) && isSocket(target)) {
				// TODO change to be a check if PVP allowed
				continue; 
			}
			if (isMob(target) && isSocket(attacker) && !didHitMob(target, attacker)) {
				this.emitter.emit(mobsConfig.SERVER_INNER.MISS_MOB.name, {mob: target, cause}, socket);
			} else {
				this.emitter.emit(config.SERVER_INNER.HIT_TARGET.name, {attacker, target, cause}, socket);
			}
			cause = config.HIT_CAUSE.AOE;
		}
	}

	[config.SERVER_INNER.HIT_TARGET.name](data: {attacker: PLAYER, target: PLAYER, cause: string}, socket: GameSocket) {
		let {attacker, target, cause} = data;

		let {dmg, crit} = getDamageDealt(attacker, target, socket);

		if (dmg === 0) {
			this.emitter.emit(config.SERVER_INNER.TARGET_BLOCKS.name, {attacker, target}, socket);
		} else {
			this.emitter.emit(config.SERVER_INNER.HURT_TARGET.name, {attacker, target, cause, dmg, crit}, socket);
		}
	}
			
	[config.SERVER_INNER.TARGET_BLOCKS.name](data: {attacker: HURTER, target: PLAYER, cause: string, dmg: number, crit: boolean}, socket: GameSocket) {
		//
	}
			
	[config.SERVER_INNER.HURT_TARGET.name](data: {attacker: HURTER, target: PLAYER, cause: string, dmg: number, crit: boolean}, socket: GameSocket) {
		const {dmg, cause, crit, attacker, target} = data;
		this.emitter.emit(config.SERVER_INNER.DMG_DEALT.name, {dmg, cause, crit, attacker, target}, socket);
	}

	[config.SERVER_INNER.DMG_DEALT.name](data: {attacker: HURTER, target: PLAYER, dmg: number, cause: string, crit: boolean}, socket: GameSocket) {
		const {dmg, cause, crit, attacker, target} = data;
		this.io.to(socket.character.room).emit(config.CLIENT_GETS.DMG_DEALT.name, {
			attacker_id: getId(attacker),
			target_id: getId(target),
            dmg,
            cause,
            crit,
			hp: getHp(target),
        });
	}

	[config.SERVER_INNER.HEAL_CHARS.name](data, socket: GameSocket) {
		const {charIds} = data;

		let cause = statsConfig.REGEN_CAUSE.HEAL;
		for (let i = 0; i < charIds.length; i++) {
			const charId = charIds[i];
			const healedSocket = socket.map.get(charId);
			if (!healedSocket || !healedSocket.connected) {
				this.sendError({charId}, socket, "No such char id");
			} else if (healedSocket.character.room !== socket.character.room) {
				this.sendError({charId}, socket, "Cannot heal someone in a different room");
			} else if (!healedSocket.alive) {
				this.sendError({charId}, socket, "Cannot heal dead people. You ain't jesus");
			} else {
                const dmgResult = calculateDamage(socket, healedSocket);
                // don't heal above the missing hp of the individual
                const dmg = Math.min(healedSocket.maxHp - healedSocket.character.stats.hp.now, dmgResult.dmg);
                if (dmg > 0) {
                    this.emitter.emit(config.SERVER_INNER.HEAL_CHAR.name, {
                        healedSocket,
                        cause,
                        dmg,
                        crit: dmgResult.crit
                    }, socket);
                }
			}
			cause = statsConfig.REGEN_CAUSE.AOE;
		}
	}
	
	[config.SERVER_INNER.HEAL_CHAR.name](data, socket: GameSocket) {
		let {healedSocket, dmg, crit, cause} = data;
		
		this.emitter.emit(statsConfig.SERVER_INNER.GAIN_HP.name, { 
			hp: dmg, 
			crit,
			cause,
		}, healedSocket);
	}
};