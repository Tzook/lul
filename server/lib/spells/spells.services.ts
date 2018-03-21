import MasterServices from "../master/master.services";
import { getServices } from "../main/bootstrap";
import spellsConfig from "./spells.config";
import { isMobInBuff } from '../talents/talents.controller';
import talentsConfig from "../talents/talents.config";
import * as _ from 'underscore';

export default class SpellsServices extends MasterServices {
	public mobsSpellsPickers: Map<string, Map<string, NodeJS.Timer>> = new Map();
	// primary ability => lvl|key => spell
	public spellsInfo: Map<string, Map<number|string, ABILITY_SPELL_MODEL>> = new Map();
}

export function getSpellsServices(): SpellsServices {
    return getServices("spells");
}

// Spells Info:
// =============
export function addSpellInfo(ability: string, spells: ABILITY_SPELL_MODEL[]) {
    const spellsArray = getSpellsArrayMap(spells);
    getSpellsServices().spellsInfo.set(ability, spellsArray);
}
function getSpellsArrayMap(spells: ABILITY_SPELL_MODEL[]){
    let result = new Map();

    for (let i = 0; i < spells.length; i++) {
        const spell = spells[i];
        result.set(spell.lvl, spell);
        result.set(spell.key, spell);
    }

    return result;
};

// Player spells:
// ===============

export function canUseSpell(socket: GameSocket, spell: ABILITY_SPELL_MODEL): boolean {
    const ability = socket.character.stats.primaryAbility;
    const talent = socket.character.talents._doc[ability];
    return talent && talent.lvl >= spell.lvl;
}

export function getSpell(socket: GameSocket, spellKey: string): ABILITY_SPELL_MODEL|undefined {
    const ability = socket.character.stats.primaryAbility;
    return getSpellsServices().spellsInfo.get(ability).get(spellKey);
}

// Mob spells:
// ============
export function mobStartSpellsPicker(mob: MOB_INSTANCE) {
    let timersMap: Map<string, NodeJS.Timer> = new Map();
    
    for (let spellKey in mob.spells) {
        activateMobSpellTimer(mob, spellKey, timersMap, false);
    }

    getSpellsServices().mobsSpellsPickers.set(mob.id, timersMap);
}

function activateMobSpellTimer(mob: MOB_INSTANCE, spellKey: string, timersMap: Map<string, NodeJS.Timer>, justSkippedSpell: boolean) {
    const {minTime, maxTime} = mob.spells[spellKey];
    const time = justSkippedSpell ? spellsConfig.SKIP_SPELL_RETRY_TIME : getMobSpellRestTime(minTime, maxTime);
    const timerId = setTimeout(() => {
        const canUseSpell = canMobUseSpell(mob);
        if (canUseSpell) {
            mobUsesSpell(mob, spellKey);
        }
        // recursively use the spell
        activateMobSpellTimer(mob, spellKey, timersMap, !canUseSpell);
    }, time);
    timersMap.set(spellKey, timerId);
}

function getMobSpellRestTime(min: number, max: number): number {
    return _.random(min * 1000, max * 1000);
}

export function mobUsesSpell(mob: MOB_INSTANCE, spellKey: string) {
    getSpellsServices().io.to(mob.room).emit(spellsConfig.CLIENT_GETS.MOB_USE_SPELL.name, {
        mob_id: mob.id,
        spell_key: spellKey,
    });
}

export function hasMobSpellsPicker(mob: MOB_INSTANCE): boolean {
    return getSpellsServices().mobsSpellsPickers.has(mob.id);
}

export function mobStopSpellsPicker(mob: MOB_INSTANCE) {
    const spellPickers = getSpellsServices().mobsSpellsPickers;
    const timersMap = spellPickers.get(mob.id);
    if (timersMap) {
        for (let [,timerId] of timersMap) {
            clearTimeout(timerId);
        }
        spellPickers.delete(mob.id);
    }
}

function canMobUseSpell(mob: MOB_INSTANCE): boolean {
    return !isMobInBuff(mob.room, mob.id, talentsConfig.PERKS.STUN_CHANCE) && !isMobInBuff(mob.room, mob.id, talentsConfig.PERKS.FREEZE_CHANCE);
}