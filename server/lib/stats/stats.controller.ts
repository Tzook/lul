'use strict';
import MasterController from '../master/master.controller';
import StatsServices from './stats.services';

export default class StatsController extends MasterController {
    protected services: StatsServices;

    public addExp(character: Char, exp: number) {
        console.log("Adding exp to char", exp, character.stats.exp, character.name);
        character.stats.exp += exp;
        // level up the char if he passed the exp needed
        let expNeededToLevel = this.services.getExp(character.stats.lvl);
        if (character.stats.exp >= expNeededToLevel) {
            character.stats.exp -= expNeededToLevel;
            this.services.lvlUp(character.stats);

            // if the char passed the exp, put his exp to 1 below the needed
            expNeededToLevel = this.services.getExp(character.stats.lvl);
            if (character.stats.exp >= expNeededToLevel) {
                console.log("Stopping 2nd level", character.stats.exp, expNeededToLevel);
                character.stats.exp = expNeededToLevel - 1;
            }
        }
    }

    public addHp(character: Char, hp: number) {
        character.stats.hp.now = Math.min(character.stats.hp.now + hp, character.stats.hp.total);
        console.log("Adding hp to char", hp, character.stats.hp.now, character.name);
    }

    public addMp(character: Char, mp: number) {
        character.stats.mp.now = Math.min(character.stats.mp.now + mp, character.stats.mp.total);
        console.log("Adding mp to char", mp, character.stats.mp.now, character.name);
    }
};