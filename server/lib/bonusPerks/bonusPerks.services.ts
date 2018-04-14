import MasterServices from '../master/master.services';
import { EQUIPS_SCHEMA } from '../equips/equips.model';
import { isSocket, getTalentsServices } from '../talents/talents.services';
import statsConfig from '../stats/stats.config';
import bonusPerksConfig from './bonusPerks.config';
import * as _ from "underscore";
import { getServices } from '../main/bootstrap';
import { getConfig } from '../socketio/socketio.services';
import talentsConfig from '../talents/talents.config';

export default class BonusPerksServices extends MasterServices {
    public clientPerks: Set<string> = new Set();
}

export function getBonusPerksServices(): BonusPerksServices {
    return getServices("bonusPerks");
}

export function setClientPerks() {
    const bonusPerksServices = getBonusPerksServices();
    const {perks} = getConfig();
    for (let perkName in perks) {
        const perk = perks[perkName];
        if (perk.client) {
            bonusPerksServices.clientPerks.add(perkName);
        }
    }
}

function getClientPerks() {
    const bonusPerksServices = getBonusPerksServices();
    return bonusPerksServices.clientPerks;
}

export function createBonusPerks(target: BONUS_PERKSABLE, char: Char) {
    target.bonusPerks = {};
    for (var itemKey in EQUIPS_SCHEMA) {
        let equip: ITEM_INSTANCE = char.equips[itemKey];
        addBonusPerks(equip, target);
    }
}

export function addBonusPerks({perks = {}}: PERKABLE, target: BONUS_PERKSABLE) {
    for (let perkName in perks || {}) {
        target.bonusPerks[perkName] = target.bonusPerks[perkName] || 0;
        target.bonusPerks[perkName] += perks[perkName];
    }
}

export function removeBonusPerks({perks = {}}: PERKABLE, target: BONUS_PERKSABLE) {
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
    let diff = {};
    for (let perkName of getClientPerks()) {
        diff[perkName] = talentsServices.getAbilityPerkValue(perkName, target, ability);
    }
    return diff;
}

export function updateBonusPerks(socket: GameSocket, oldStats: PERKS_DIFF, newStats: PERKS_DIFF) {
    if (oldStats[talentsConfig.PERKS.HP_BONUS] != newStats[talentsConfig.PERKS.HP_BONUS] || oldStats[talentsConfig.PERKS.MP_BONUS] != newStats[talentsConfig.PERKS.MP_BONUS]) {
        const stats = {hp: newStats[talentsConfig.PERKS.HP_BONUS] - oldStats[talentsConfig.PERKS.HP_BONUS], mp: newStats[talentsConfig.PERKS.MP_BONUS] - oldStats[talentsConfig.PERKS.MP_BONUS]};
        socket.emitter.emit(statsConfig.SERVER_INNER.STATS_ADD.name, { stats, checkMaxStats: false }, socket);
    }
    
    let diff: PERKS_DIFF = {};
    let hasDiff = false;
    for (let perkName of getClientPerks()) {
        if (oldStats[perkName] != newStats[perkName]) {
            hasDiff = true;
            diff[perkName] = newStats[perkName];
        }
    }
    
    if (hasDiff) {
        notifyBonusPerks(socket, diff);
    }
}

export function notifyBonusPerks(socket: GameSocket, diff: PERKS_DIFF) {
    let dataToSend = Object.assign({
        id: socket.character._id
    }, diff);
    if (diff[talentsConfig.PERKS.HP_BONUS] || _.isNumber(diff[talentsConfig.PERKS.HP_BONUS])) {
        dataToSend[talentsConfig.PERKS.HP_BONUS] = socket.maxHp;
    }
    if (diff[talentsConfig.PERKS.MP_BONUS] || _.isNumber(diff[talentsConfig.PERKS.MP_BONUS])) {
        dataToSend[talentsConfig.PERKS.MP_BONUS] = socket.maxMp;
    }
    socket.emit(bonusPerksConfig.CLIENT_GETS.UPDATE_CLIENT_PERKS.name, dataToSend);
    socket.broadcast.to(socket.character.room).emit(bonusPerksConfig.CLIENT_GETS.UPDATE_CLIENT_PERKS.name, dataToSend);
}

export function getEmptyBonusPerks(): PERKS_DIFF {
    const talentsServices = getTalentsServices();
    let defaults = {};
    for (let perkName of getClientPerks()) {
        defaults[perkName] = talentsServices.getPerkDefault(perkName);
    }
    return defaults;
}

export function slightlyTweakPerks(perksObject: PERK_MAP): PERK_MAP {
    let result: PERK_MAP = {};
    const offset = bonusPerksConfig.PERK_VALUES_RANDOM_OFFSET;

    for (let perkName in perksObject) {
        let perkValue = perksObject[perkName];
    	result[perkName] = perkValue;
        continue;
	// TODO fix the roundiness
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
