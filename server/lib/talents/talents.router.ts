import SocketioRouterBase from '../socketio/socketio.router.base';
import TalentsMiddleware from './talents.middleware';
import TalentsController from './talents.controller';
import TalentsServices, { getTalent, hasAbility } from './talents.services';
import talentsConfig from '../talents/talents.config';
import statsConfig from '../stats/stats.config';
import StatsRouter from '../stats/stats.router';
import MobsRouter from '../mobs/mobs.router';
import mobsConfig from '../mobs/mobs.config';
import RoomsRouter from '../rooms/rooms.router';
import combatConfig from '../combat/combat.config';

export default class TalentsRouter extends SocketioRouterBase {
	protected middleware: TalentsMiddleware;
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
			this.middleware.validateHasSercetKey.bind(this.middleware),
			this.controller.generateTalents.bind(this.controller));
	}	

    public onConnected(socket: GameSocket) {
		socket.getTargetsHit = (targetIds) => this.services.getTargetsHit(targetIds, socket);
		socket.getLoadModifier = () => this.services.getLoadModifier(socket);
		socket.getDmgModifier = (attacker: GameSocket|MOB_INSTANCE, target: GameSocket|MOB_INSTANCE) => this.services.getDmgModifier(attacker, target);
		socket.getThreatModifier = () => this.services.getThreatModifier(socket);
		socket.getDefenceModifier = (attacker: GameSocket|MOB_INSTANCE, target: GameSocket|MOB_INSTANCE) => this.services.getDefenceModifier(attacker, target);
		socket.getHpRegenModifier = () => this.services.getHpRegenModifier(socket);
		socket.getMpRegenModifier = () => this.services.getMpRegenModifier(socket);
		socket.getHpRegenInterval = () => this.services.getHpRegenInterval(socket);
		socket.getMpRegenInterval = () => this.services.getMpRegenInterval(socket);
        socket.buffs = new Map();
        socket.bonusPerks = {};
		process.nextTick(() => this.addStats(socket));
	}

	public getAbilityInfo(ability: string): TALENT_INFO|undefined {
		return this.services.getTalentInfo(ability);
	}

	public getPrimaryTalentInfo(socket: GameSocket): TALENT_INFO|undefined {
		return this.services.getTalentInfo(socket.character.stats.primaryAbility);
	}
	
	[talentsConfig.SERVER_GETS.DISCONNECT.name](data, socket: GameSocket) {
		this.controller.clearSocketBuffs(socket);		
	}

	[talentsConfig.SERVER_GETS.ENTERED_ROOM.name](data, socket: GameSocket) {
		this.controller.notifyAboutBuffs(socket);
	}

    [talentsConfig.SERVER_INNER.GAIN_ABILITY.name] (data, socket: GameSocket) {
		const {ability} = data;
		if (hasAbility(socket, ability)) {
			return this.sendError(data, socket, "Cannot gain ability - Already has that primary ability.");
		} else if (!this.services.getTalentInfo(ability)) {
			return this.sendError(data, socket, "Cannot gain ability - No ability information.", true, true);
		}
		this.services.addAbility(socket, ability);
		
		socket.emit(talentsConfig.CLIENT_GETS.GAIN_ABILITY.name, {
			ability: socket.character.talents._doc[ability],
			key: ability
		});
	}
	
	[talentsConfig.SERVER_INNER.HURT_MOB.name]({dmg, mob, cause, crit}: {dmg: number, mob: MOB_INSTANCE, cause: string, crit: boolean}, socket: GameSocket) {
		const mobModel = this.mobsRouter.getMobInfo(mob.mobId);
		const exp = this.services.getAbilityExp(dmg, mobModel);
		this.emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY_EXP.name, {exp}, socket);
		if (mob.hp > 0 && cause !== combatConfig.HIT_CAUSE.BLEED && cause !== combatConfig.HIT_CAUSE.BURN) {
			this.controller.applyHurtMobPerks(dmg, crit, mob, socket);
		}
		this.controller.applySelfPerks(dmg, socket);
	}
	
	[talentsConfig.SERVER_INNER.HEAL_CHAR.name](data, socket: GameSocket) {
		let {dmg} = data;
		
		// TODO use a better formula for heal ability exp 
		const exp = dmg; 

		this.emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY_EXP.name, {exp}, socket);
		this.controller.applySelfPerks(dmg, socket);
	}
	
    [talentsConfig.SERVER_INNER.TOOK_DMG.name] (data, socket: GameSocket) {
		let {dmg, mob, cause, crit} = data;
		if (!socket.alive) {
			this.controller.clearSocketBuffs(socket);
		} else if (cause !== combatConfig.HIT_CAUSE.BLEED && cause !== combatConfig.HIT_CAUSE.BURN) {
			this.controller.applyMobHurtPerks(dmg, crit, mob, socket);
		}
    }
	
	[talentsConfig.SERVER_INNER.GAIN_ABILITY_EXP.name]({exp}: {exp: number}, socket: GameSocket) {
		const ability = socket.character.stats.primaryAbility;
        const talent = socket.character.talents._doc[ability];
        if (!talent) {
            return;
        }
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
		this.services.markAbilityModified(socket, ability);
	}
	
	[talentsConfig.SERVER_INNER.GAIN_ABILITY_LVL.name]({talent, ability}: {talent: CHAR_ABILITY_TALENT, ability: string}, socket: GameSocket) {
		talent.lvl++;
		talent.points++;
		this.emitter.emit(talentsConfig.SERVER_INNER.GENERATE_PERK_POOL.name, {talent, ability}, socket);		
		socket.emit(talentsConfig.CLIENT_GETS.GAIN_ABILITY_LVL.name, {
			ability,
			lvl: talent.lvl,
			points: talent.points,
		});
		this.services.markAbilityModified(socket, ability);
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
		this.services.markAbilityModified(socket, ability);
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
		const oldStats = this.getAbilityStats(socket);        
        this.services.addPerk(talent, perk);
		const newStats = this.getAbilityStats(socket);        
		this.updateStats(socket, oldStats, newStats);
		talent.points--;
		talent.pool = [];
		socket.emit(talentsConfig.CLIENT_GETS.GAIN_ABILITY_PERK.name, {
			ability,
			perk,
		});
		if (talent.points > 0) {
			this.emitter.emit(talentsConfig.SERVER_INNER.GENERATE_PERK_POOL.name, {talent, ability}, socket);		
		}
		this.services.markAbilityModified(socket, ability);
	}
	
    [talentsConfig.SERVER_INNER.GAIN_LVL.name] (data, socket: GameSocket) {
		this.emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY_LVL.name, {talent: socket.character.charTalents._doc[talentsConfig.CHAR_TALENT], ability: talentsConfig.CHAR_TALENT}, socket);
    }

	[talentsConfig.SERVER_GETS.USE_SPELL.name](data, socket: GameSocket) {
		const {spell_key} = data;
		const spell = this.services.getSpell(socket, spell_key);
		if (!spell) {
			return this.sendError(data, socket, "The primary ability does not have that spell.");	
		} else if (!this.services.canUseSpell(socket, spell)) {
			return this.sendError(data, socket, "Character does not meet the requirements to use that spell.");
		} else if (socket.character.stats.mp.now < spell.mp) {
			return this.sendError(data, socket, "Not enough mana to activate the spell.");
		}

		this.emitter.emit(statsConfig.SERVER_INNER.USE_MP.name, {
			mp: spell.mp
		}, socket);
		
		socket.broadcast.to(socket.character.room).emit(talentsConfig.CLIENT_GETS.USE_SPELL.name, {
			char_id: socket.character._id,
            spell_key,
		});
	}

	[talentsConfig.SERVER_GETS.HIT_SPELL.name](data, socket: GameSocket) {
		const {target_ids, spell_key} = data;
		const spell = this.services.getSpell(socket, spell_key);
		if (!spell) {
			return this.sendError(data, socket, "The primary ability does not have that spell.");	
		} else if (!this.services.canUseSpell(socket, spell)) {
			return this.sendError(data, socket, "Character does not meet the requirements to use that spell.");
		}

		socket.currentSpell = spell;
		
		this.emitter.emit(combatConfig.SERVER_GETS.USE_ABILITY.name, {target_ids}, socket);		
		
		socket.currentSpell = null;
	}

	[talentsConfig.SERVER_GETS.HURT_BY_SPELL.name](data, socket: GameSocket) {
		let {mob_id, spell_key} = data;
		let mob = this.mobsRouter.getMob(mob_id, socket);
		if (!mob) {
			return this.sendError(data, socket, "Mob doesn't exist!");
		} else if (!(mob.spells || {})[spell_key]) {
			return this.sendError(data, socket, "Mob doesn't have that spell!");
		}
		
		mob.currentSpell = mob.spells[spell_key];

		this.emitter.emit(mobsConfig.SERVER_GETS.PLAYER_TAKE_DMG.name, data, socket);

		mob.currentSpell = null;
	}
	
	[talentsConfig.SERVER_INNER.MOB_AGGRO_CHANGED.name](data) {
		let {id, mob}: {mob: MOB_INSTANCE, id?: string} = data;	
		if (mob.spells) {
			if (!id) {
				this.controller.mobStopSpellsPicker(mob);
			} else if (!this.controller.hasMobSpellsPicker(mob)) {
				this.controller.mobStartSpellsPicker(mob);
			}
		}		
	}
	
	[talentsConfig.SERVER_INNER.MOB_DESPAWN.name](data: {mob: MOB_INSTANCE}, socket: GameSocket) {
		let {mob} = data;
		if (mob.spells) {
			this.controller.mobStopSpellsPicker(mob);
		}
		this.controller.clearMobBuffs(socket.character.room, mob.id);
	}
	
	[talentsConfig.SERVER_INNER.CHANGED_ABILITY.name](data, socket: GameSocket) {
		let {previousAbility} = data;

		const oldStats = this.getAbilityStats(socket, previousAbility);
		const newStats = this.getAbilityStats(socket);
		this.updateStats(socket, oldStats, newStats);
    }
    
	[talentsConfig.SERVER_INNER.LEFT_ROOM.name](data, socket: GameSocket) {
		if (!hasAbility(socket, socket.character.stats.primaryAbility)) {
            this.emitter.emit(combatConfig.SERVER_GETS.CHANGE_ABILITY.name, { 
                ability: statsConfig.ABILITY_MELEE
            }, socket);
        }
	}
    
    private addStats(socket: GameSocket) {
        const stats = this.getAbilityStats(socket);
        this.emitter.emit(statsConfig.SERVER_INNER.STATS_ADD.name, { stats, validate: false }, socket);
    }
    
    private updateStats(socket: GameSocket, oldStats: {hp: number, mp: number}, newStats: {hp: number, mp: number}) {
        if (oldStats.hp != newStats.hp || oldStats.mp != newStats.mp) {
            const stats = {hp: newStats.hp - oldStats.hp, mp: newStats.mp - oldStats.mp};
            this.emitter.emit(statsConfig.SERVER_INNER.STATS_ADD.name, { stats }, socket);
        }
    }

	private getAbilityStats(socket: GameSocket, ability?: string) {
		return {
			hp: this.services.getHpBonus(socket, ability),
			mp: this.services.getMpBonus(socket, ability),
		};
	}
};
