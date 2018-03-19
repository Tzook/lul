
import MasterServices from '../master/master.services';
import { getDamageRange } from '../mobs/mobs.services';

export default class CombatServices extends MasterServices {
    
};

export function calculateDamage(socket: GameSocket, target: PLAYER): DMG_RESULT {
    const talent = socket.character.talents._doc[socket.character.stats.primaryAbility];
    let baseDmg = (talent || {lvl: 1}).lvl * 2 + 1;
    baseDmg += socket.getDmgBonus();
    let load = socket.lastAttackLoad || 0;
    let loadDmg = socket.getLoadModifier() * load * baseDmg / 100;
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