import MasterServices from '../master/master.services';
import { EQUIPS_SCHEMA } from '../equips/equips.model';
import { isSocket, getTalentsServices } from '../talents/talents.services';
import statsConfig from '../stats/stats.config';
import bonusPerksConfig from './bonusPerks.config';
import talentsConfig from '../talents/talents.config';
import * as _ from "underscore";

export default class BonusPerksServices extends MasterServices {

}


export function createBonusPerks(socket: GameSocket) {
    socket.bonusPerks = {};
    for (var itemKey in EQUIPS_SCHEMA) {
        let equip: ITEM_INSTANCE = socket.character.equips[itemKey];
        addBonusPerks(equip, socket);
    }
}

export function addBonusPerks({perks = {}}: {perks?: PERK_MAP}, target: PLAYER) {
    for (let perkName in perks || {}) {
        target.bonusPerks[perkName] = target.bonusPerks[perkName] || 0;
        target.bonusPerks[perkName] += perks[perkName];
    }
}

export function removeBonusPerks({perks = {}}: {perks?: PERK_MAP}, target: PLAYER) {
    for (let perkName in perks || {}) {
        target.bonusPerks[perkName] -= perks[perkName];
        if (!target.bonusPerks[perkName]) {
            delete target.bonusPerks[perkName];
        }
    }
}

export function modifyBonusPerks(target: PLAYER, modificationsCallback: Function) {
	const oldStats = getBonusPerks(target);
	modificationsCallback();
	const newStats = getBonusPerks(target);
	if (isSocket(target)) {
		// currently only socket supports these perks..
		updateBonusPerks(<GameSocket>target, oldStats, newStats);
	}
}

export function getBonusPerks(target: PLAYER, ability?: string): PERKS_DIFF {
    const talentsServices = getTalentsServices();
    return {
        hp: talentsServices.getHpBonus(target, ability),
        mp: talentsServices.getMpBonus(target, ability),
        atkSpeed: talentsServices.getAtkSpeedModifier(target, ability),
        mpCost: talentsServices.getMpUsageModifier(target, ability),
    };
}

export function updateBonusPerks(socket: GameSocket, oldStats: PERKS_DIFF, newStats: PERKS_DIFF) {
	if (oldStats.hp != newStats.hp || oldStats.mp != newStats.mp) {
		const stats = {hp: newStats.hp - oldStats.hp, mp: newStats.mp - oldStats.mp};
		socket.emitter.emit(statsConfig.SERVER_INNER.STATS_ADD.name, { stats }, socket);
	}
	if (oldStats.atkSpeed != newStats.atkSpeed) {
		socket.emit(bonusPerksConfig.CLIENT_GETS.UPDATE_ATTACK_SPEED.name, {speed: newStats.atkSpeed});
	}
	if (oldStats.mpCost != newStats.mpCost) {
		socket.emit(bonusPerksConfig.CLIENT_GETS.UPDATE_MANA_COST.name, {mpCost: newStats.mpCost});
	}
}

export function getEmptyBonusPerks(): PERKS_DIFF {
    const talentsServices = getTalentsServices();
    return { 
        hp: talentsServices.getPerkDefault(talentsConfig.PERKS.HP_BONUS), 
        mp: talentsServices.getPerkDefault(talentsConfig.PERKS.MP_BONUS), 
		atkSpeed: talentsServices.getPerkDefault(talentsConfig.PERKS.ATK_SPEED_MODIFIER_KEY),
		mpCost: talentsServices.getPerkDefault(talentsConfig.PERKS.MP_COST)
    };
}

export function slightlyTweakPerks(perksObject: PERK_MAP): PERK_MAP {
    let result: PERK_MAP = {};
    const offset = bonusPerksConfig.PERK_VALUES_RANDOM_OFFSET;

    for (let perkName in perksObject) {
        let perkValue = perksObject[perkName];

        // get a random number between -0.1 and 0.1
        const random = Math.random() * offset * 2 - offset;
        let addition = perkValue * random;

        // round extra floating points
        const numberParts = ("" + perkValue / 10).split(".");
        const firstNoneZeroDigitIndex = numberParts[1] ? _.findIndex(numberParts[1].split(""), item => item !== "0") : -1;
        
        result[perkName] = +(perkValue + addition).toFixed(firstNoneZeroDigitIndex + 1);
    }    

    return result;
}