
import MasterMiddleware from '../master/master.middleware';
import { hasAbility } from '../talents/talents.services';

export default class CombatMiddleware extends MasterMiddleware {
    public getValidLoad(load): number {
        return load >= 1 && load <= 100 ? (load | 0) : 0;
    }

    public canChangeAbility(socket: GameSocket, ability: string): boolean {
        return hasAbility(socket, ability);
    }
};