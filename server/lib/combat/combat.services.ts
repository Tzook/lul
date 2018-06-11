
import MasterServices from '../master/master.services';
import { getDamageRange, getHurtCharDmg } from '../mobs/mobs.services';
import { getServices } from '../main/bootstrap';
import combatConfig from './combat.config';
import { isSocket } from '../talents/talents.services';
import { getMob } from '../mobs/mobs.controller';
import { sendError } from '../socketio/socketio.errors';
import statsConfig from '../stats/stats.config';
import * as _ from 'underscore';
import { getRoomInfo } from '../rooms/rooms.services';

export default class CombatServices extends MasterServices {
    public attacksInfos: Map<string, ATTACK_INFO> = new Map();
};

function getCombatServices(): CombatServices {
    return getServices("combat");
}

export function setAttackInfo(socket: GameSocket, id: string, load: number, additionInfo?: {}) {
    const attackInfosMap = getCombatServices().attacksInfos;
    const key = getAttackInfoMapKey(socket, id);
    const timerId = setTimeout(() => attackInfosMap.delete(key), combatConfig.ATTACK_INFO_ALIVE_TIME);
    attackInfosMap.set(key, createAttackInfo(socket, load, timerId, additionInfo));
}

export function createAttackInfo(socket: GameSocket, load: number, timerId?: NodeJS.Timer, additionInfo?: {}): ATTACK_INFO {
    return Object.assign({
        timerId,
        load,
        ability: socket.character.stats.primaryAbility,
    }, additionInfo)
}

export function popAttackInfo(socket: GameSocket, id: string): ATTACK_INFO {
    const attackInfosMap = getCombatServices().attacksInfos;
    const key = getAttackInfoMapKey(socket, id);
    const attackInfo = attackInfosMap.get(key);
    if (attackInfo) {
        clearTimeout(attackInfo.timerId);
        attackInfosMap.delete(key);
    }
    return attackInfo;
}

function getAttackInfoMapKey(socket: GameSocket, id: string): string {
    return `${socket.character.name}-${id}`;
}

export function calculateDamage(socket: GameSocket, target: PLAYER): DMG_RESULT {
    const talent = socket.character.talents._doc[socket.character.stats.primaryAbility];
    let baseDmg = (talent || {lvl: 1}).lvl * 2 + 1;
    baseDmg += socket.getDmgBonus();
    let loadDmg = socket.getLoadModifier() * socket.lastAttackLoad * baseDmg / 100;
    let dmgModifier = socket.getDmgModifier(socket, target);
    let maxDmg = (baseDmg + loadDmg) * dmgModifier.dmg;
    let minDmg = maxDmg * socket.getMinDmgModifier(socket);
    let dmg = getDamageRange(minDmg, maxDmg);
    return {dmg, crit: dmgModifier.crit};
}
	
export function applyDefenceModifier(dmg: number, socket: GameSocket, attacker: PLAYER, target: PLAYER) {
    dmg = Math.max(0, dmg - socket.getDefenceBonus(target));
    dmg *= socket.getDefenceModifier(attacker, target);
    dmg = Math.ceil(dmg); // make sure we are always rounded
    return dmg;
}

export function getDamageDealt(attacker: PLAYER, target: PLAYER, socket: GameSocket): DMG_RESULT {
    let dmgResult = isSocket(attacker) 
        ? calculateDamage(attacker, target)
        : getHurtCharDmg(attacker, target, socket);
    dmgResult.dmg = applyDefenceModifier(dmgResult.dmg, socket, attacker, target);
    return dmgResult;
}

export function extendRoomWithCombat(scene: any, roomSchema: ROOM_MODEL): void {
    if (scene.pvp == "true") {
        roomSchema.pvp = true;
    } else {
        let roomUpdateObject: any = roomSchema;
        roomUpdateObject.$unset = roomUpdateObject.$unset || {};
        roomUpdateObject.$unset.pvp = true;
    }
	if (scene.canSetMainAbility === "true") {
        roomSchema.mainable = true;
	} else {
        let roomUpdateObject: any = roomSchema;
        roomUpdateObject.$unset = roomUpdateObject.$unset || {};
        roomUpdateObject.$unset.mainable = true;
    }
}

export function getValidTargets(socket: GameSocket, targetIds: string[]): PLAYER[] {
    let targets: PLAYER[] = [];

    for (let targetId of targetIds) {
        let target: PLAYER = getMob(targetId, socket);
        if (!target) {
            const targetSocket = socket.map.get(targetId);
            if (targetSocket && targetSocket.connected && targetSocket.alive) {
                target = targetSocket;
            }
        }
        
        if (!target) {
            sendError({targetId}, socket, "Target doesn't exist!");
        } else {
            targets.push(target);
        }
    }

    return targets;
}

export function hasMainAbility(socket: GameSocket, ability: string): boolean {
	return _.contains(getMainAbilities(socket), ability);
}

function getMainAbilities(socket: GameSocket): string[] {
    return _.isEmpty(socket.character.mainAbilities) ? [statsConfig.ABILITY_MELEE] : socket.character.mainAbilities;
}

export function canSetMainAbility(socket: GameSocket): boolean {
    return getRoomInfo(socket.character.room).mainable;
}

export function addMainAbility(socket: GameSocket, ability: string) {
	let mainAbilities = getMainAbilities(socket);
	mainAbilities.push(ability);
	if (mainAbilities.length > 2) {
		mainAbilities.shift();
    }
    socket.character.mainAbilities = mainAbilities;
}