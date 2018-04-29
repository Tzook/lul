
import MasterServices from '../master/master.services';
import * as _ from "underscore";
import { doesChanceWork } from '../drops/drops.services';
import { extendMobSchemaWithTalents, isSocket } from '../talents/talents.services';
import mobsConfig from '../mobs/mobs.config';
import { getServices, getEmitter } from '../main/bootstrap';
import { getItemsInfo } from '../items/items.services';
import { getMobsController } from './mobs.controller';

export default class MobsServices extends MasterServices {
	public mobsDrops: Map<number, DROP_MODEL[]> = new Map();
	public mobsInfo: Map<string, MOB_MODEL> = new Map();

	public getMobInfo(mobId: string): MOB_MODEL|undefined {
		// always return a copy of the mob, so it can be modified freely
		const mob = this.mobsInfo.get(mobId);
		return mob && Object.assign({}, mob);
	}

	public getMobRoomId(room: string, mobId: string): string {
		return `${room}-${mobId}`;
	}

	public getDamageToHurt(hp: number, dmg: number): number {
		return Math.min(hp, dmg);
	}

    public getExp(mob: MOB_INSTANCE, charDmg: number): number {
        // we round the exp up for the character :)
        return Math.ceil(mob.exp * (charDmg / mob.dmged));
	}
	
	public didHitMob(mobLvl: number, myLvl: number): boolean {
		const lvlDifference = myLvl - mobLvl + mobsConfig.MISS_CHANCE_LVLS;
		const chance = lvlDifference * mobsConfig.MISS_CHANCE_PER_LVL;
		return doesChanceWork(chance);
	}

    // HTTP functions
	// =================
	public generateMobs(mobs: any[]): Promise<any> {
		console.log("Generating mobs from data:", mobs);
		
		let mobModels = [];

		(mobs || []).forEach(mob => {
			let mobId = mob.key;

			let drops = [];
			(mob.drops || []).forEach(drop => {
				let { key, minStack, maxStack } = drop;
				if (minStack >= 1 && maxStack > 1) {
					drops.push({ key, minStack, maxStack });
				} else {
					drops.push({ key });
				}
			});

			let mobSchema: MOB_MODEL = {
				mobId,
				hp: mob.hp,
				lvl: mob.level,
				exp: mob.exp,
				dmg: mob.dmg,
				drops,
			};

			extendMobSchemaWithTalents(mob, mobSchema);

			let mobModel = new this.Model(mobSchema);
			mobModels.push(mobModel);
		});

		return this.Model.remove({})
			.then(d => this.Model.create(mobModels));
	}

	public getMobs(): Promise<Map<string, MOB_MODEL>> {
		return this.Model.find({}).lean()
			.then((docs: MOB_MODEL[]) => {
				docs.forEach(doc => {
					this.mobsInfo.set(doc.mobId, doc);
				});
				console.log("got mobs");
				getEmitter().emit(mobsConfig.GLOBAL_EVENTS.GLOBAL_MOBS_READY.name, this.mobsInfo);				
				return this.mobsInfo;
			});
	}
};

function getMobsServices(): MobsServices {
	return getServices("mobs");
}

export function getMobInfo(mobId: string): MOB_MODEL|undefined {
	return getMobsServices().getMobInfo(mobId);
}

function setMobsExtraDrops() {
	const mobsServices = getMobsServices();
	
	const mobsMaxLevel = getMaxMobLevel(mobsServices.mobsInfo);
	
	for (let [,{key, mobsDrop = {}}] of getItemsInfo()) {
		let {minLvl, maxLvl, minStack, maxStack} = mobsDrop;
		if (!minLvl && !maxLvl) {
			continue;
		}
		if (!minLvl) {
			minLvl = 1;
		}
		if (!maxLvl || maxLvl > mobsMaxLevel) {
			maxLvl = mobsMaxLevel;
		}
		let drop: DROP_MODEL = {key};
		if (minStack) drop.minStack = minStack;
		if (maxStack) drop.maxStack = maxStack;
		for (let lvl = minLvl; lvl <= maxLvl; lvl++) {
			addDropToExtraDrops(mobsServices.mobsDrops, lvl, drop);
		}
	}
}
// call it only after it has been called for 2 times, so we know both mobs and items have loaded
export const setMobsExtraDropsAfter2 = _.after(2, setMobsExtraDrops);

function addDropToExtraDrops(mobsDrops: Map<number, DROP_MODEL[]>, lvl: number, drop: DROP_MODEL) {
	let lvlDrops = mobsDrops.get(lvl);
	if (!lvlDrops) {
		lvlDrops = [];
		mobsDrops.set(lvl, lvlDrops);
	}
	lvlDrops.push(drop);
}

export function getMobExtraDrops(lvl: number): DROP_MODEL[] {
	return getMobsServices().mobsDrops.get(lvl) || [];
}

function getMaxMobLevel(mobs: Map<string, MOB_MODEL>) {
	let max = 0;
	for (let [,{lvl}] of mobs) {
		if (lvl > max) {
			max = lvl;
		}
	}
	return max;
}

export function shouldMobHaveExtraDrops(mob: MOB_MODEL): boolean {
	return mob.dmg > 0 && mob.exp > 0;
}

export function getDamageRange(min: number, max: number): number {
	return _.random(Math.floor(min) || 1, Math.floor(max));
}

export function getSpawnIntervalTime(spawn: SPAWN_INSTANCE) {
	let minOffset = spawn.interval > 1 ? -mobsConfig.SPAWN_INTERVAL_OFFSET : 0;
	let maxOffset = spawn.interval > 1 ? mobsConfig.SPAWN_INTERVAL_OFFSET : 0;
	return spawn.interval * 1000 + _.random(minOffset, maxOffset);
}

export function getPartyShareExp(totalExp: number, partySockets: GameSocket[]) {
    let expModifier = 1 + (partySockets.length - 1) * 0.1;
    let exp = Math.ceil(expModifier * totalExp / partySockets.length);
    return exp;
}

export function spawnMob(mobKey: string, x: number, y: number, room: string, bonusPerks: PERK_MAP = {}): MOB_INSTANCE {
	return getMobsController().spawnMob(mobKey, x, y, room, bonusPerks);
}

export function didHitMob(mobId: string, socket: GameSocket): boolean {
	let mob = getMobsController().getMob(mobId, socket);
	return mob.hp > 0 && getMobsServices().didHitMob(mob.lvl, socket.character.stats.lvl);
}

export function getHurtCharDmg(mob: MOB_INSTANCE, target: PLAYER, socket: GameSocket): DMG_RESULT {
	let dmgModifierResult = socket.getDmgModifier(mob, target);
	let maxDmg = mob.dmg * dmgModifierResult.dmg;
	let minDmg = maxDmg * socket.getMinDmgModifier(mob);
	let dmg = getDamageRange(minDmg, maxDmg);
	return {dmg, crit: dmgModifierResult.crit};
}

export function addThreat(mob: MOB_INSTANCE, threat: number, attacker: PLAYER) {
	if (isSocket(attacker)) {
		getMobsController().addThreat(mob, threat, attacker);
	}
}