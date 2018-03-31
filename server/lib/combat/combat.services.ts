
import MasterServices from '../master/master.services';
import { getDamageRange } from '../mobs/mobs.services';
import { getServices } from '../main/bootstrap';
import combatConfig from './combat.config';

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
    attackInfosMap.set(key, Object.assign({
        timerId,
        load,
        ability: socket.character.stats.primaryAbility,
    }, additionInfo));
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
	
export function applyDefenceModifier(dmg: number, socket: GameSocket, attacker: GameSocket|MOB_INSTANCE, target: GameSocket|MOB_INSTANCE) {
    dmg = Math.max(0, dmg - socket.getDefenceBonus(target));
    dmg *= socket.getDefenceModifier(attacker, target);
    dmg = Math.ceil(dmg); // make sure we are always rounded
    return dmg;
}

export function getDamageTaken(socket: GameSocket, target: PLAYER): DMG_RESULT {
    let dmgResult = calculateDamage(socket, target);
    dmgResult.dmg = applyDefenceModifier(dmgResult.dmg, socket, socket, target);
    return dmgResult;
}