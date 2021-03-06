import SocketioRouterBase from '../socketio/socketio.router.base';
import spellsConfig from './spells.config';
import statsConfig from '../stats/stats.config';
import combatConfig from '../combat/combat.config';
import { getMobDeadOrAlive, getMob } from '../mobs/mobs.controller';
import { getMpUsage, markAbilityModified } from '../talents/talents.services';
import { mobStopSpellsPicker, hasMobSpellsPicker, mobStartSpellsPicker, mobUsesSpell, canUseSpell, addSpellInfo, getSpell, getTalentSpell, upgradeSpellPerks, isSpellInCooldown, setSpellInCooldown, updateAboutCooldowns, getTargetIdsHurtBySpell } from './spells.services';
import { setAttackInfo, popAttackInfo, getValidTargets } from '../combat/combat.services';
import { getExp } from '../stats/stats.services';

export default class SpellsRouter extends SocketioRouterBase {
	[spellsConfig.SERVER_GETS.ENTERED_ROOM.name](data, socket: GameSocket) {
		updateAboutCooldowns(socket);
    }

    [spellsConfig.GLOBAL_EVENTS.GLOBAL_TALENT_READY.name]({doc}: {doc: TALENT_MODEL}) {
        addSpellInfo(doc.ability, doc.spells);
    }

	[spellsConfig.SERVER_GETS.USE_SPELL.name](data, socket: GameSocket) {
		const {spell_key, attack_id} = data;
		if (!attack_id) {
			return this.sendError(data, socket, "Must include an attack id");
		}
		const spell = getSpell(spell_key);
		if (!spell) {
			return this.sendError(data, socket, "The primary ability does not have that spell.");	
		} else if (!canUseSpell(socket, spell)) {
			return this.sendError(data, socket, "Character does not meet the requirements to use that spell.");
		}

		if (isSpellInCooldown(socket, spell)) {
			return this.sendError(data, socket, "Spell is in cooldown.");
		}

		let mp = getMpUsage(spell.mp, socket);
		if (socket.character.stats.mp.now < mp) {
			return this.sendError(data, socket, "Not enough mana to activate the spell.");
		}

		this.emitter.emit(statsConfig.SERVER_INNER.USE_MP.name, { mp }, socket);
		setSpellInCooldown(socket, spell);

		setAttackInfo(socket, attack_id, 0, {spell_key});
		socket.broadcast.to(socket.character.room).emit(spellsConfig.CLIENT_GETS.USE_SPELL.name, {
			char_id: socket.character._id,
            spell_key,
		});
	}

	[spellsConfig.SERVER_GETS.HIT_SPELL.name](data, socket: GameSocket) {
		const {target_ids, attack_id} = data;
		
		const attackInfo = popAttackInfo(socket, attack_id);
		if (!attackInfo) {
			return this.sendError(data, socket, "Spell must be used before it hits");
		}

		const spell = getSpell(attackInfo.spell_key);
		if (!spell) {
			return this.sendError(data, socket, "The primary ability does not have that spell.");	
		} else if (!canUseSpell(socket, spell, attackInfo.ability)) {
			return this.sendError(data, socket, "Character does not meet the requirements to use that spell.");
		}

		const talentSpell = getTalentSpell(socket, spell, attackInfo.ability);

		socket.currentSpell = talentSpell;
		
		const validTargets = getValidTargets(socket, target_ids);
		const validTargetIds = getTargetIdsHurtBySpell(talentSpell, validTargets);

		if (validTargetIds.length > 0) {
			this.emitter.emit(combatConfig.SERVER_INNER.ACTIVATE_ABILITY.name, {target_ids: validTargetIds, attackInfo, cause: combatConfig.HIT_CAUSE.SPELL}, socket);
		}
		
		socket.currentSpell = null;
	}
	
	[spellsConfig.SERVER_INNER.GAIN_PRIMARY_ABILITY_EXP.name]({exp}: {exp: number}, socket: GameSocket) {
		if (socket.currentSpell) {
			const spellKey = socket.currentSpell.key;
			const talentSpell = socket.character.talents._doc[socket.character.stats.primaryAbility].spells[spellKey];
			talentSpell.exp += exp;
			const expNeededToLevel = getExp(talentSpell.lvl);
			const shouldLvl = talentSpell.exp >= expNeededToLevel;
			if (shouldLvl) {
				talentSpell.exp = 0;
			}
			socket.emit(spellsConfig.CLIENT_GETS.GAIN_SPELL_EXP.name, {
				spellKey,
				exp,
				now: talentSpell.exp
			});
			if (shouldLvl) {
				talentSpell.lvl++;
				upgradeSpellPerks(socket.currentSpell, talentSpell);
				socket.emit(spellsConfig.CLIENT_GETS.GAIN_SPELL_LVL.name, {
					spellKey,
					ability: socket.character.stats.primaryAbility,
					lvl: talentSpell.lvl,
					perks: talentSpell.bonusPerks
				});
			}
			markAbilityModified(socket);
		}
	}

	[spellsConfig.SERVER_GETS.HURT_BY_SPELL.name](data, socket: GameSocket) {
		let {mob_id, spell_key} = data;
		let mob = getMobDeadOrAlive(mob_id, socket);
		if (!mob) {
			return this.sendError(data, socket, "Mob doesn't exist");
		}
		let spell: MOB_SPELL_BASE;
		if (getMob(mob_id, socket)) {
			// mob is still alive
			spell = (mob.spells || {})[spell_key];
		} else {
			// mob is dead
			spell = mob.deathSpell && mob.deathSpell.key === spell_key ? mob.deathSpell : null;
		}
		if (!spell) {
			return this.sendError(data, socket, "Mob doesn't have that spell");
		}
		
		mob.currentSpell = spell;

		const validTargetIds = getTargetIdsHurtBySpell(spell, [socket]);

		if (validTargetIds.length > 0) {
			this.emitter.emit(combatConfig.SERVER_INNER.ATK_TARGETS.name, {attacker: mob, target_ids: validTargetIds, cause: combatConfig.HIT_CAUSE.SPELL}, socket);
		}

		mob.currentSpell = null;
    }

	[spellsConfig.SERVER_INNER.MOB_AGGRO_CHANGED.name](data) {
		let {id, mob}: {mob: MOB_INSTANCE, id?: string} = data;	
		if (mob.spells) {
			if (!id) {
				mobStopSpellsPicker(mob);
			} else if (!hasMobSpellsPicker(mob)) {
				mobStartSpellsPicker(mob);
			}
		}		
	}
	
	[spellsConfig.SERVER_INNER.MOB_DESPAWN.name](data: {mob: MOB_INSTANCE}, socket: GameSocket) {
		let {mob} = data;
		if (mob.spells) {
			mobStopSpellsPicker(mob);
        }
        if (mob.deathSpell) {
            mobUsesSpell(mob, mob.deathSpell, mob.deathSpell.key);
        }
	}
}