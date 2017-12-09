import SocketioRouterBase from '../socketio/socketio.router.base';
import TalentsMiddleware from './talents.middleware';
import TalentsController from './talents.controller';
import TalentsServices from './talents.services';
import talentsConfig from '../talents/talents.config';
import statsConfig from '../stats/stats.config';
import StatsRouter from '../stats/stats.router';
import StatsServices from '../stats/stats.services';
import MobsRouter from '../mobs/mobs.router';
import mobsConfig from '../mobs/mobs.config';
import RoomsRouter from '../rooms/rooms.router';

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
		socket.getMobsHit = (mobs) => this.services.getMobsHit(mobs, socket);
		socket.getLoadModifier = () => this.services.getLoadModifier(socket);
		socket.getDmgModifier = () => this.services.getDmgModifier(socket);
		socket.buffs = new Set();
	}
	
	[talentsConfig.SERVER_GETS.DISCONNECT.name](data, socket: GameSocket) {
		this.controller.clearSocketBuffs(socket);		
	}

	[talentsConfig.SERVER_GETS.ENTERED_ROOM.name](data, socket: GameSocket) {
		this.controller.notifyAboutBuffs(socket);
		
		if (this.controller.isMobsSpellsPickersPaused(socket.character.room)) {
			this.controller.continueMobsSpellsPickers(socket.character.room);
		}
	}

	[talentsConfig.SERVER_INNER.LEFT_ROOM.name](data, socket: GameSocket) {
		if (this.roomsRouter.isEmpty(socket.character.room)) {
			this.controller.pauseMobsSpellsPickers(socket.character.room);
		}
	}

    [talentsConfig.SERVER_INNER.GAIN_ABILITY.name] (data, socket: GameSocket) {
		if (!socket.character.talents._doc[data.ability]) {
			socket.character.talents._doc[data.ability] = this.services.getEmptyCharAbility();
		}
	}
	
	[talentsConfig.SERVER_INNER.HURT_MOB.name]({dmg, mob, cause}: {dmg: number, mob: MOB_INSTANCE, cause: string}, socket: GameSocket) {
		const mobModel = this.mobsRouter.getMobInfo(mob.mobId);
		const exp = this.services.getAbilityExp(dmg, mobModel);
		this.emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY_EXP.name, {exp}, socket);
		if (mob.hp > 0 && cause !== talentsConfig.PERKS.BLEED_DMG_CAUSE) {
			this.controller.applyHurtMobPerks(dmg, mob, socket);
		}
		this.controller.applySelfPerks(dmg, socket);
	}
	
    [talentsConfig.SERVER_INNER.TOOK_DMG.name] (data, socket: GameSocket) {
		let {dmg, mob, cause} = data;
		if (!socket.alive) {
			this.controller.clearSocketBuffs(socket);
		} else if (cause !== talentsConfig.PERKS.BLEED_DMG_CAUSE) {
			this.controller.applyMobHurtPerks(dmg, mob, socket);
		}
    }
	
	[talentsConfig.SERVER_INNER.GAIN_ABILITY_EXP.name]({exp}: {exp: number}, socket: GameSocket) {
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
		this.services.markAbilityModified(socket);
	}
	
	[talentsConfig.SERVER_INNER.GAIN_ABILITY_LVL.name]({}, socket: GameSocket) {
		const ability = socket.character.stats.primaryAbility;
		const talent = socket.character.talents._doc[ability];
		talent.lvl++;
		talent.points++;
		this.emitter.emit(talentsConfig.SERVER_INNER.GENERATE_PERK_POOL.name, {}, socket);		
		socket.emit(talentsConfig.CLIENT_GETS.GAIN_ABILITY_LVL.name, {
			ability,
			lvl: talent.lvl,
			points: talent.points,
		});
		this.services.markAbilityModified(socket);
	}
	
	[talentsConfig.SERVER_INNER.GENERATE_PERK_POOL.name]({}, socket: GameSocket) {
		const ability = socket.character.stats.primaryAbility;
		const talent = socket.character.talents._doc[ability];
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
		this.services.markAbilityModified(socket);
	}
	
	[talentsConfig.SERVER_GETS.CHOOSE_ABILITY_PERK.name](data, socket: GameSocket) {
		const {ability, perk} = data;
		if (!StatsServices.hasAbility(socket, ability)) {
			return this.sendError(data, socket, "Char does not have that primary ability.");
		}
		const talent = socket.character.talents._doc[ability];
		if (!this.services.canGetPerk(talent, perk)) {
			return this.sendError(data, socket, "Raising points to that perk is not available.");
		}
		this.services.addPerk(talent, perk);		
		talent.points--;
		talent.pool = [];
		socket.emit(talentsConfig.CLIENT_GETS.GAIN_ABILITY_PERK.name, {
			ability,
			perk,
		});
		if (talent.points > 0) {
			this.emitter.emit(talentsConfig.SERVER_INNER.GENERATE_PERK_POOL.name, {}, socket);		
		}
		this.services.markAbilityModified(socket);
	}

	[talentsConfig.SERVER_GETS.USE_SPELL.name](data, socket: GameSocket) {
		const {target_ids, spell_key} = data;
		const spell = this.services.getSpell(socket, spell_key);
		if (!spell) {
			return this.sendError(data, socket, "The primary ability does not have that spell.");	
		} else if (!this.services.canUseSpell(socket, spell)) {
			return this.sendError(data, socket, "Character does not meet the requirements to use that spell.");
		} else if (socket.character.stats.mp.now < spell.mp) {
			return this.sendError(data, socket, "Not enough mana to activate the spell.");
		}

		socket.currentSpell = spell;
		
		this.emitter.emit(statsConfig.SERVER_INNER.USE_MP.name, {
			mp: spell.mp
		}, socket);
		
		// TODO only take dmg if spell actually does dmg
		this.emitter.emit(mobsConfig.SERVER_GETS.MOBS_TAKE_DMG.name, {mobs: target_ids}, socket);		
		
		socket.broadcast.to(socket.character.room).emit(talentsConfig.CLIENT_GETS.USE_SPELL.name, {
			activator_id: socket.character._id,
            spell_key,
		});
		
		socket.currentSpell = null;
	}

	[talentsConfig.SERVER_GETS.MOB_USE_SPELL.name](data, socket: GameSocket) {
		let {mob_id, spell_key} = data;
		let mob = this.mobsRouter.getMob(mob_id, socket);
		if (!mob) {
			return this.sendError(data, socket, "Mob doesn't exist!");
		} else if (!(mob.spells || {})[spell_key]) {
			return this.sendError(data, socket, "Mob doesn't have that spell!");
		}
		mob.currentSpell = mob.spells[spell_key];

		// TODO only take dmg if spell actually does dmg
		this.emitter.emit(mobsConfig.SERVER_GETS.PLAYER_TAKE_DMG.name, data, socket);

		mob.currentSpell = null;
	}
	
	[talentsConfig.SERVER_INNER.MOB_SPAWNED.name](data) {
		let {mob, room}: {mob: MOB_INSTANCE, room: string} = data;
		if (mob.spells) {
			const isRoomEmpty = this.roomsRouter.isEmpty(room);
			this.controller.mobStartSpellsPicker(mob, room, isRoomEmpty);
		}
	}
	
	[talentsConfig.SERVER_INNER.MOB_DESPAWN.name](data, socket: GameSocket) {
		let {mob} = data;
		if (mob.spells) {
			this.controller.mobStopSpellsPicker(mob, socket.character.room);
		}
	}
};
