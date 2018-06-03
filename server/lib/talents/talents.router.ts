import SocketioRouterBase from '../socketio/socketio.router.base';
import TalentsController from './talents.controller';
import TalentsServices, { getTalent, hasAbility, getTalentInfo, isCharAbility, isSocket, getHp, isMob, applySpikes, markAbilityModified } from './talents.services';
import talentsConfig from '../talents/talents.config';
import statsConfig from '../stats/stats.config';
import StatsRouter from '../stats/stats.router';
import MobsRouter from '../mobs/mobs.router';
import RoomsRouter from '../rooms/rooms.router';
import combatConfig from '../combat/combat.config';
import { modifyBonusPerks } from '../bonusPerks/bonusPerks.services';
import { getDamageDealt } from '../combat/combat.services';
import { isBoss } from '../master/master.middleware';

export default class TalentsRouter extends SocketioRouterBase {
	protected controller: TalentsController;
	protected services: TalentsServices;
	protected statsRouter: StatsRouter;
	protected mobsRouter: MobsRouter;
	protected roomsRouter: RoomsRouter;

	init(files, app) {
		this.services = files.services;
		this.statsRouter = files.routers.stats;
		this.mobsRouter = files.routers.mobs;
		this.roomsRouter = files.routers.rooms;
		super.init(files, app);
	}

	protected initRoutes(app) {
		app.post(this.ROUTES.GENERATE,
			isBoss,
			this.controller.generateTalents.bind(this.controller));
	}	
	
    [talentsConfig.GLOBAL_EVENTS.CONFIG_READY.name]() {
		this.services.setBuffPerks();
    }

    public onConnected(socket: GameSocket) {
		socket.getTargetsHit = (targetIds) => this.services.getTargetsHit(targetIds, socket);
		socket.getLoadModifier = () => this.services.getLoadModifier(socket);
		socket.getDmgBonus = () => this.services.getDmgBonus(socket);
		socket.getDmgModifier = (attacker: PLAYER, target: PLAYER) => this.services.getDmgModifier(attacker, target);
		socket.getMinDmgModifier = (attacker: PLAYER) => this.services.getMinDmgModifier(attacker);
		socket.getThreatModifier = () => this.services.getThreatModifier(socket);
		socket.getDefenceModifier = (attacker: PLAYER, target: PLAYER) => this.services.getDefenceModifier(attacker, target);
		socket.getDefenceBonus = (target: PLAYER) => this.services.getDefenceBonus(target);
		socket.getHpRegenModifier = () => this.services.getHpRegenModifier(socket);
		socket.getMpRegenModifier = () => this.services.getMpRegenModifier(socket);
		socket.getHpRegenInterval = () => this.services.getHpRegenInterval(socket);
		socket.getMpRegenInterval = () => this.services.getMpRegenInterval(socket);
		socket.getMpUsageModifier = () => this.services.getMpUsageModifier(socket);
        socket.buffs = new Map();
	}

	public getAbilityInfo(ability: string): TALENT_INFO|undefined {
		return getTalentInfo(ability);
	}

	public getPrimaryTalentInfo(socket: GameSocket): TALENT_INFO|undefined {
		return getTalentInfo(socket.character.stats.primaryAbility);
	}
	
	[talentsConfig.SERVER_GETS.DISCONNECT.name](data, socket: GameSocket) {
		this.controller.clearBuffs(socket);		
	}

	[talentsConfig.SERVER_GETS.ENTERED_ROOM.name](data, socket: GameSocket) {
		this.controller.notifyAboutBuffs(socket);
	}

    [talentsConfig.SERVER_INNER.GAIN_ABILITY.name] (data, socket: GameSocket) {
		const {ability} = data;
		if (hasAbility(socket, ability)) {
			return this.sendError(data, socket, "Cannot gain ability - Already has that primary ability.");
		} else if (!getTalentInfo(ability)) {
			return this.sendError(data, socket, "Cannot gain ability - No ability information", true, true);
		}
		this.services.addAbility(socket, ability);
		
		let talent = getTalent(socket, ability);
		socket.emit(talentsConfig.CLIENT_GETS.GAIN_ABILITY.name, {
			ability: talent,
			isCharAbility: isCharAbility(ability),
			key: ability
		});
	}
	
	[talentsConfig.SERVER_INNER.ATK_TARGETS.name](data: {attacker: HURTER, target: PLAYER, dmg: number, cause: string, crit: boolean}, socket: GameSocket) {
		const {attacker} = data;
		if (isSocket(attacker) || isMob(attacker)) {
			this.controller.applySelfBuffPerks(attacker);
		}
	}

	[talentsConfig.SERVER_INNER.DMG_DEALT.name](data: {attacker: HURTER, target: PLAYER, dmg: number, cause: string, crit: boolean}, socket: GameSocket) {
		const {dmg, cause, crit, attacker, target} = data;
		if (isSocket(attacker)) {
			const exp = this.services.getAbilityExp(dmg, target);
			this.emitter.emit(talentsConfig.SERVER_INNER.GAIN_PRIMARY_ABILITY_EXP.name, {exp}, attacker);
			this.controller.applySelfPerks(dmg, attacker);
		}

		if (isSocket(target) && !target.alive) {
			this.controller.clearBuffs(target);			
		} else if ((isMob(attacker) || isSocket(attacker)) && isSocket(target) && cause === combatConfig.HIT_CAUSE.ATK && getHp(attacker) > 0) {
			// spikes
            let spikesModifier = this.services.getSpikesModifier(target);
            if (spikesModifier > 0) {
                let dmgResult = getDamageDealt(target, attacker, socket);
				dmgResult.dmg = applySpikes(dmgResult.dmg, spikesModifier);
				this.emitter.emit(combatConfig.SERVER_INNER.HURT_TARGET.name, {
					attacker: target, 
					target: attacker, 
					cause: combatConfig.HIT_CAUSE.SPIKES, 
					dmg: dmgResult.dmg, 
					crit: dmgResult.crit
				}, socket);
            }
		}
		if (getHp(target) > 0 && cause !== combatConfig.HIT_CAUSE.BLEED && cause !== combatConfig.HIT_CAUSE.BURN && cause !== combatConfig.HIT_CAUSE.SPIKES) {
			this.controller.applyHurtPerks(dmg, crit, attacker, target, socket);
		}
	}
	
	[talentsConfig.SERVER_INNER.HEAL_CHAR.name](data, socket: GameSocket) {
		let {dmg} = data;
		
		// TODO use a better formula for heal ability exp 
		const exp = dmg * 2;

		this.emitter.emit(talentsConfig.SERVER_INNER.GAIN_PRIMARY_ABILITY_EXP.name, {exp}, socket);
		this.controller.applySelfPerks(dmg, socket);
	}
	
	[talentsConfig.SERVER_INNER.GAIN_CHAR_ABILITY_EXP.name]({exp, ability}: {exp: number, ability: string}, socket: GameSocket) {
        let talent = socket.character.charTalents._doc[ability];
        if (!talent) {
			// add the ability if it doesn't exist
			this.emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY.name, {ability}, socket);
			talent = socket.character.charTalents._doc[ability];
        }
		this.emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY_EXP.name, {exp, talent, ability}, socket);
	}
	
	[talentsConfig.SERVER_INNER.GAIN_PRIMARY_ABILITY_EXP.name]({exp}: {exp: number}, socket: GameSocket) {
		const ability = socket.character.stats.primaryAbility;
        const talent = socket.character.talents._doc[ability];
        if (!talent) {
            return;
        }
		this.emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY_EXP.name, {exp, talent, ability}, socket);
	}
	
	[talentsConfig.SERVER_INNER.GAIN_ABILITY_EXP.name]({exp, talent, ability}: {exp: number, talent: CHAR_ABILITY_TALENT, ability: string}, socket: GameSocket) {
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
			this.emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY_LVL.name, {talent, ability}, socket);
		}
		markAbilityModified(socket, ability);
	}
	
	[talentsConfig.SERVER_INNER.GAIN_ABILITY_LVL.name]({talent, ability}: {talent: CHAR_ABILITY_TALENT, ability: string}, socket: GameSocket) {
		talent.lvl++;
		talent.points++;
		this.emitter.emit(talentsConfig.SERVER_INNER.GENERATE_PERK_POOL.name, {talent, ability}, socket);		
		this.io.to(socket.character.room).emit(talentsConfig.CLIENT_GETS.GAIN_ABILITY_LVL.name, {
			id: socket.character._id,
			ability,
			lvl: talent.lvl,
			points: talent.points,
		});
		markAbilityModified(socket, ability);
	}
	
	[talentsConfig.SERVER_INNER.GENERATE_PERK_POOL.name]({talent, ability}: {talent: CHAR_ABILITY_TALENT, ability: string}, socket: GameSocket) {
		const pool = this.services.getPerksPool(ability, talent);
		this.log({pool}, socket, "Gain perk pool");
		if (pool.length > 0) {
			talent.pool = pool;
			socket.emit(talentsConfig.CLIENT_GETS.CHOOSE_ABILITY_PERK.name, {
				ability,
				pool,
			});
		} else {
			// no pool - so just take off a point
			talent.points--;
		}
		markAbilityModified(socket, ability);
	}
	
	[talentsConfig.SERVER_GETS.CHOOSE_ABILITY_PERK.name](data, socket: GameSocket) {
		const {ability, perk} = data;
		const talent = getTalent(socket, ability);
		if (!talent) {
			return this.sendError(data, socket, "Char does not have that primary ability.");
		}
		if (!this.services.canGetPerk(talent, perk)) {
			return this.sendError(data, socket, "Raising points to that perk is not available.");
		}
		modifyBonusPerks(socket, () => {
			this.services.addPerk(talent, perk);
		});
		talent.points--;
		talent.pool = [];
		if (talent.points > 0) {
			this.emitter.emit(talentsConfig.SERVER_INNER.GENERATE_PERK_POOL.name, {talent, ability}, socket);		
		}
		socket.emit(talentsConfig.CLIENT_GETS.GAIN_ABILITY_PERK.name, {
			ability,
			perk,
		});
		markAbilityModified(socket, ability);
	}
	
    [talentsConfig.SERVER_INNER.GAIN_LVL.name] (data, socket: GameSocket) {
		this.emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY_LVL.name, {talent: socket.character.charTalents._doc[talentsConfig.CHAR_TALENT], ability: talentsConfig.CHAR_TALENT}, socket);
    }
	
	[talentsConfig.SERVER_INNER.MOB_DESPAWN.name](data: {mob: MOB_INSTANCE}, socket: GameSocket) {
		let {mob} = data;
		this.controller.clearBuffs(mob);
	}
    
	[talentsConfig.SERVER_INNER.LEFT_ROOM.name](data, socket: GameSocket) {
        // make sure that the user doesn't have the room's ability if he doesn't own it
		if (!hasAbility(socket, socket.character.stats.primaryAbility)) {
            this.emitter.emit(combatConfig.SERVER_GETS.CHANGE_ABILITY.name, { 
                ability: statsConfig.ABILITY_MELEE
            }, socket);
        }
	}
	
	[talentsConfig.SERVER_INNER.QUEST_COMPLETED.name]({questInfo}: {questInfo: QUEST_MODEL}, socket: GameSocket) {
		// reward ability
		if ((questInfo.reward || {}).ability) {
			this.emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY.name, { ability: questInfo.reward.ability }, socket);
		}
		
		if ((questInfo.reward || {}).exp) {
			this.emitter.emit(talentsConfig.SERVER_INNER.GAIN_CHAR_ABILITY_EXP.name, { 
				ability: talentsConfig.CHAR_QUESTS_TALENT,
				exp: questInfo.reward.exp * 2
			}, socket);
		}
	}
};