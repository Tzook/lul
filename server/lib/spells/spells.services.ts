import MasterServices from "../master/master.services";
import { getServices } from "../main/bootstrap";
import spellsConfig from "./spells.config";
import { isMobInBuff } from '../talents/talents.controller';
import talentsConfig from "../talents/talents.config";
import * as _ from 'underscore';
import { pickRandomly } from "../drops/drops.services";
import { spawnMob } from "../mobs/mobs.services";
import { joinObjects } from "../utils/objects";
import { markAbilityModified } from "../talents/talents.services";
import { tweakPerks } from "../bonusPerks/bonusPerks.services";

export default class SpellsServices extends MasterServices {
	public mobsSpellsPickers: Map<string, NodeJS.Timer> = new Map();
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

export function canUseSpell(socket: GameSocket, spell: ABILITY_SPELL_MODEL, ability?: string): boolean {
    ability = ability || socket.character.stats.primaryAbility;
    const talent = socket.character.talents._doc[ability];
    return talent && talent.lvl >= spell.lvl;
}

export function getSpell(socket: GameSocket, spellKey: string): ABILITY_SPELL_MODEL|undefined {
    const ability = socket.character.stats.primaryAbility;
    return getSpellsServices().spellsInfo.get(ability).get(spellKey);
}

export function getTalentSpell(socket: GameSocket, spellModel: ABILITY_SPELL_MODEL, ability: string): ACTIVE_SPELL {
    let talent = socket.character.talents._doc[ability];
    if (!talent.spells) {
        talent.spells = {};
    }
    if (!talent.spells[spellModel.key]) {
        talent.spells[spellModel.key] = getEmptySpell();
        markAbilityModified(socket, ability);
    }

    return {perks: joinObjects(talent.spells[spellModel.key].bonusPerks, spellModel.perks), spell: spellModel};
}

function getEmptySpell(): CHAR_TALENT_SPELL {
    return {
        lvl: 1,
        exp: 0,
        bonusPerks: {}
    }
}

export function upgradeSpellPerks(spellModel: ABILITY_SPELL_MODEL, talentSpell: CHAR_TALENT_SPELL) {
    const addedPerks = tweakSpellPerks(spellModel.perks);
    talentSpell.bonusPerks = joinObjects(talentSpell.bonusPerks, addedPerks);
}

function tweakSpellPerks(perksObject: PERK_MAP): PERK_MAP {
    return tweakPerks(perksObject, spellsConfig.PERK_LEVEL_BONUS_OFFSET, false, true);
}

// Mob spells:
// ============
export function mobStartSpellsPicker(mob: MOB_INSTANCE) {
    activateMobSpellTimer(mob, false);
}

function activateMobSpellTimer(mob: MOB_INSTANCE, justSkippedSpell: boolean) {
    const time = justSkippedSpell ? spellsConfig.SKIP_SPELL_RETRY_TIME : getMobSpellRestTime(mob.spellMinTime, mob.spellMaxTime);
    const timerId = setTimeout(() => {
        const canUseSpell = canMobUseSpell(mob);
        if (canUseSpell) {
            const spellKey = pickSpell(mob);
            if (spellKey) {
                mobUsesSpell(mob, mob.spells[spellKey], spellKey);
            }
        }
        // recursively use the spell
        activateMobSpellTimer(mob, !canUseSpell);
    }, time);

    getSpellsServices().mobsSpellsPickers.set(mob.id, timerId);
}

function pickSpell(mob: MOB_INSTANCE): string {
    return <string>pickRandomly(mob.spells);
}

function getMobSpellRestTime(min: number, max: number): number {
    return _.random(min * 1000, max * 1000);
}

export function mobUsesSpell(mob: MOB_INSTANCE, spell: MOB_SPELL_BASE, spellKey: string) {
    getSpellsServices().io.to(mob.room).emit(spellsConfig.CLIENT_GETS.MOB_USE_SPELL.name, {
        mob_id: mob.id,
        spell_key: spellKey,
    });
    (spell.spawn || []).forEach(mobKey => {
        spawnMob(mobKey, mob.x, mob.y, mob.room, spell.perks);
    });
}

export function hasMobSpellsPicker(mob: MOB_INSTANCE): boolean {
    return getSpellsServices().mobsSpellsPickers.has(mob.id);
}

export function mobStopSpellsPicker(mob: MOB_INSTANCE) {
    const spellPickers = getSpellsServices().mobsSpellsPickers;
    const timerId = spellPickers.get(mob.id);
    if (timerId) {
        clearTimeout(timerId);
        spellPickers.delete(mob.id);
    }
}

function canMobUseSpell(mob: MOB_INSTANCE): boolean {
    return !isMobInBuff(mob.room, mob.id, talentsConfig.PERKS.STUN_CHANCE);
}