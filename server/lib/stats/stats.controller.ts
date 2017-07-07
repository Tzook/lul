'use strict';
import MasterController from '../master/master.controller';
import StatsServices from './stats.services';

export default class StatsController extends MasterController {
    protected services: StatsServices;

    public addExp(socket: GameSocket, exp: number) {
        const {character} = socket;
        character.stats.exp += exp;
        // level up the char if he passed the exp needed
        let expNeededToLevel = this.services.getExp(character.stats.lvl);
        if (character.stats.exp >= expNeededToLevel) {
            character.stats.exp -= expNeededToLevel;
            this.services.lvlUp(socket);

            // if the char passed the exp, put his exp to 1 below the needed
            expNeededToLevel = this.services.getExp(character.stats.lvl);
            if (character.stats.exp >= expNeededToLevel) {
                console.log("Stopping 2nd level", character.stats.exp, expNeededToLevel);
                character.stats.exp = expNeededToLevel - 1;
            }
        }
    }

    public addHp(socket: GameSocket, hp: number): boolean {
        let nowHp = socket.character.stats.hp.now;
        socket.character.stats.hp.now = Math.min(nowHp + hp, socket.maxHp);
        let gainedHp = nowHp !== socket.character.stats.hp.now;
        return gainedHp;
    }

    public addMp(socket: GameSocket, mp: number): boolean {
        let nowMp = socket.character.stats.mp.now;
        socket.character.stats.mp.now = Math.min(nowMp + mp, socket.maxMp);
        let gainedMp = nowMp !== socket.character.stats.mp.now;
        return gainedMp;
    }
};