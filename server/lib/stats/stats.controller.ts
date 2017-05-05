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

    public addHp(character: Char, hp: number): boolean {
        let nowHp = character.stats.hp.now;
        character.stats.hp.now = Math.min(nowHp + hp, character.stats.hp.total);
        let gainedHp = nowHp !== character.stats.hp.now;
        console.log("Adding hp to char", hp, character.stats.hp.now, character.name);
        return gainedHp;
    }

    public addMp(character: Char, mp: number): boolean {
        let nowMp = character.stats.mp.now;
        character.stats.mp.now = Math.min(nowMp + mp, character.stats.mp.total);
        let gainedMp = nowMp !== character.stats.mp.now;
        console.log("Adding mp to char", mp, character.stats.mp.now, character.name);
        return gainedMp;
    }
};