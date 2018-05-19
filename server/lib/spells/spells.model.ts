import MasterModel from "../master/master.model";
import { getPerksSchema } from "../talents/talents.services";
import { PRIORITY_MOBS } from '../mobs/mobs.model';
import { PRIORITY_TALENTS } from "../talents/talents.model";
import * as mongoose from 'mongoose';

const ABILITY_SPELL_SCHEMA = (<any>mongoose.Schema)({
    key: String,
    lvl: Number,
    mp: Number,
    perks: mongoose.Schema.Types.Mixed,
    cd: Number,
    condBuff: mongoose.Schema.Types.Mixed,
    clearBuffs: mongoose.Schema.Types.Mixed,
}, {_id: false});

const MOB_SPELLS_SCHEMA = {
    spells: mongoose.Schema.Types.Mixed,
    spellMinTime: Number,
    spellMaxTime: Number,
    deathSpell: mongoose.Schema.Types.Mixed,
};

export const PRIORITY_SPELLS = PRIORITY_TALENTS + PRIORITY_MOBS + 10;

export default class SpellsModel extends MasterModel {

    init(files, app) {
        this.minimize = true;
    }
    
    get priority() {
        return PRIORITY_SPELLS;
    }
    
    createModel() {
        this.addToSchema("Talent", {spells: [ABILITY_SPELL_SCHEMA]});
        this.addToSchema("Mobs", MOB_SPELLS_SCHEMA);
        return Promise.resolve();
    }
};

export function extendTalentsGenerationWithSpells(talent: any, talentSchema: TALENT_MODEL) {
    (talent.spells || []).forEach(spell => {
        let spellSchema: ABILITY_SPELL_MODEL = {
            ...getBaseSpell(spell),
            key: spell.key,
            lvl: spell.level,
            mp: spell.mana,
        };
        if (spell.cooldown > 0) {
            spellSchema.cd = +spell.cooldown;
        }
        talentSchema.spells.push(spellSchema);
    });
}

export function extendMobSchemaWithSpells(mob: any, mobSchema: MOB_MODEL): void {
	(mob.spells || []).forEach(spell => {
		mobSchema.spells = mobSchema.spells || {};
        let spellSchema: MOB_SPELL = {
            ...getBaseSpell(spell),
            chance: +spell.chance,
        };
        extendMobSpellWithSpawn(spellSchema, spell);
        mobSchema.spells[spell.key] = spellSchema;
    });
    if (mob.spellsMinTime > 0 && mob.spellsMaxTime > 0) {
        mobSchema.spellMinTime = +mob.spellsMinTime;
        mobSchema.spellMaxTime = +mob.spellsMaxTime;
    }
    
    if (mob.deathRattle) {
        let deathRattle: MOB_DEATH_SPELL = {
            ...getBaseSpell(mob.deathRattle),
            key: mob.deathRattle.key,
        }
        if (mob.deathRattle.duration > 0) {
            deathRattle.duration = +mob.deathRattle.duration;
        }
        extendMobSpellWithSpawn(deathRattle, mob.deathRattle);
        mobSchema.deathSpell = deathRattle;
    }
}

function getBaseSpell(spell: any): SPELL_BASE {
    let spellSchema: SPELL_BASE = {
        perks: getPerksSchema(spell.perks),
    };
    (spell.hitIfTargetHasBuff || []).forEach(buffName => {
        spellSchema.condBuff = spellSchema.condBuff || [];
        spellSchema.condBuff.push(buffName);
    });
    (spell.clearTargetBuffs || []).forEach(buffName => {
        spellSchema.clearBuffs = spellSchema.clearBuffs || [];
        spellSchema.clearBuffs.push(buffName);
    });
    console.log("Got base spell", spell, spellSchema);
    return spellSchema;
}

function extendMobSpellWithSpawn(spell: MOB_DEATH_SPELL|MOB_SPELL, mobSpellSchema: any) {
    (mobSpellSchema.spawnMobs || []).forEach(mobKey => {
        spell.spawn = spell.spawn || [];
        spell.spawn.push(mobKey);
    });
}