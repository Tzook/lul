'use strict';
import MasterMiddleware from '../master/master.middleware';

export default class CombatMiddleware extends MasterMiddleware {
    public getValidLoad(load): number {
        return load >= 1 && load <= 100 ? (load | 0) : 0;
    }

    public canChangeAbility(socket: GameSocket, ability: string): boolean {
        return (<any>socket.character.stats.abilities).includes(ability);
    }
};