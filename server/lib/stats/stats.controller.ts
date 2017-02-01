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
};