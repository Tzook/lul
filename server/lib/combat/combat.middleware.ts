
import MasterMiddleware from '../master/master.middleware';
import StatsServices from '../stats/stats.services';

export default class CombatMiddleware extends MasterMiddleware {
    public getValidLoad(load): number {
        return load >= 1 && load <= 100 ? (load | 0) : 0;
    }

    public canChangeAbility(socket: GameSocket, ability: string): boolean {
        return StatsServices.hasAbility(socket, ability);
    }
};