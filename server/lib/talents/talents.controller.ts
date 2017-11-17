import MasterController from '../master/master.controller';
import TalentsServices from './talents.services';
import talentsConfig from '../talents/talents.config';
import MobsRouter from '../mobs/mobs.router';

export default class TalentsController extends MasterController {
	protected services: TalentsServices;
	protected mobsRouter: MobsRouter;
	protected roomToBuff: Map<string, Map<string, Map<string, BUFF_INSTANCE>>> = new Map();

	init(files, app) {
		this.mobsRouter = files.routers.mobs;
		super.init(files, app);
	}

	public applyHurtMobPerks(dmg: number, mob: MOB_INSTANCE, socket: GameSocket) {
		this.tryToApplyPerk(talentsConfig.PERKS.STUN_CHANCE, talentsConfig.PERKS.STUN_DURATION, mob, socket);
		this.tryToApplyPerk(talentsConfig.PERKS.CRIPPLE_CHANCE, talentsConfig.PERKS.CRIPPLE_DURATION, mob, socket);
		this.tryToApplyPerk(talentsConfig.PERKS.BLEED_CHANCE, talentsConfig.PERKS.BLEED_DURATION, mob, socket);
	}
	
	public tryToApplyPerk(perkChanceName: string, perkDurationName: string, mob: MOB_INSTANCE, socket: GameSocket) {
		const activated = this.services.isAbilityActivated(perkChanceName, socket);
		if (activated) {
			const room = socket.character.room;
			let mobBuffs = this.getMobBuffsInstance(room, mob);
			if (mobBuffs.has(perkChanceName)) {
				this.clearBuff(room, mob.id, perkChanceName);
				mobBuffs = this.getMobBuffsInstance(room, mob);
			}
			let duration = this.services.getAbilityPerkValue(perkDurationName, socket);
			socket.emit(talentsConfig.CLIENT_GETS.ACTIVATED_BUFF.name, {
				target_id: mob.id,
				key: perkChanceName,
				duration,
			});
			let clearTimeoutId = setTimeout(() => this.clearBuff(room, mob.id, perkChanceName), duration * 1000);
			mobBuffs.set(perkChanceName, {
				clearTimeoutId,
				key: perkChanceName,
				duration,
				initTime: Date.now(),
			});
		}
	}

	public notifyAboutBuffs(socket: GameSocket) {
		let roomMap = this.getRoomBuffsInstance(socket.character.room);
		for (let [mobId, mobBuffs] of roomMap) {
			let hasMob = this.mobsRouter.hasMob(mobId, socket);
			for (let [buffName, buffInstance] of mobBuffs) {
				if (hasMob) {
					const secondsPassed = (Date.now() - buffInstance.initTime) / 1000;
					const duration = (buffInstance.duration - secondsPassed).toFixed(2);
					socket.emit(talentsConfig.CLIENT_GETS.ACTIVATED_BUFF.name, {
						target_id: mobId,
						key: buffName,
						duration,
					});
				} else {
					this.clearBuff(socket.character.room, mobId, buffName);
				}
			}
		}
	}

	protected clearBuff(room: string, mobId: string, buffName: string) {
		let roomMap = this.roomToBuff.get(room);
		let mobsBuff = roomMap.get(mobId);
		let buffInstance = mobsBuff.get(buffName);
		clearTimeout(buffInstance.clearTimeoutId);
		mobsBuff.delete(buffName);
		if (mobsBuff.size === 0) {
			roomMap.delete(mobId);
		}
		if (roomMap.size === 0) {
			this.roomToBuff.delete(room);
		}
	} 

	protected getRoomBuffsInstance(room: string) {
		let roomBuffs = this.roomToBuff.get(room);
		if (!roomBuffs) {
			roomBuffs = new Map();
			this.roomToBuff.set(room, roomBuffs);
		}
		return roomBuffs;
	}

	protected getMobBuffsInstance(room: string, mob: MOB_INSTANCE) {
		let roomBuffs = this.getRoomBuffsInstance(room);
		let mobBuffs = roomBuffs.get(mob.id);
		if (!mobBuffs) {
			mobBuffs = new Map();
			roomBuffs.set(mob.id, mobBuffs);
		}
		return mobBuffs;
	}
    
    // HTTP functions
	// =================
	public generateTalents(req, res, next) {
        this.services.generateTalents(req.body.talents, req.body.perkCollection)
			.then(d => {
				this.sendData(res, this.LOGS.GENERATE_TALENTS, d);
			})
			.catch(e => {
				this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "generateTalents", file: "talents.controller.js"});
			});
    }

	public warmTalentsInfo(): void {
		this.services.getTalents()
			.catch(e => {
				console.error("Had an error getting talents from the db!");
				throw e;
			});
	}
};