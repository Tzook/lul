import MasterModel from "../master/master.model";
import { getPerksSchema } from "../talents/talents.services";
import { PRIORITY_MOBS } from '../mobs/mobs.model';
import { PRIORITY_TALENTS } from "../talents/talents.model";
import * as mongoose from 'mongoose';

const ABILITY_SPELL_SCHEMA = (<any>mongoose.Schema)({
    key: String,
    lvl: Number,
    mp: Number,
    perks: mongoose.Schema.Types.Mixed
}, {_id: false});

const MOB_SPELLS_SCHEMA = {
    spells: mongoose.Schema.Types.Mixed,
    deathSpell: mongoose.Schema.Types.Mixed,
};

export const PRIORITY_SPELLS = PRIORITY_TALENTS + PRIORITY_MOBS + 10;

export default class SpellsModel extends MasterModel {

    init(files, app) {
        this.minimize = true;
    
        this.addToSchema("Talent", {spells: [ABILITY_SPELL_SCHEMA]});
        this.addToSchema("Mobs", MOB_SPELLS_SCHEMA);
    }

    get priority() {
        return PRIORITY_SPELLS;
    }

    createModel() {
        return Promise.resolve();
    }
};

export function extendTalentsGenerationWithSpells(talent: any, talentSchema: TALENT_MODEL) {
    (talent.spells || []).forEach(spell => {
        let spellSchema: ABILITY_SPELL_MODEL = {
            key: spell.key,
            lvl: spell.level,
            mp: spell.mana,
            perks: {},
        };
        (spell.perks || []).forEach(perk => {
            spellSchema.perks[perk.key] = +perk.value;
        });
        talentSchema.spells.push(spellSchema);
    });
}

export function extendMobSchemaWithSpells(mob: any, mobSchema: MOB_MODEL): void {
	(mob.spells || []).forEach(spell => {
		mobSchema.spells = mobSchema.spells || {};
        let spellSchema: MOB_SPELL = <MOB_SPELL>getPerksSchema(spell.perks);
        spellSchema.minTime = spell.minTime;
        spellSchema.maxTime = spell.maxTime;
        mobSchema.spells[spell.key] = spellSchema;
    });
    
    if (mob.deathRattle) {
        let deathRattle: MOB_DEATH_SPELL = <MOB_DEATH_SPELL>getPerksSchema(mob.deathRattle.perks);
        deathRattle.key = mob.deathRattle.key;
        mobSchema.deathSpell = deathRattle;
    }
}