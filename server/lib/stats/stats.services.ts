import MasterServices from '../master/master.services';
import * as _ from 'underscore';
import { getServices } from '../main/bootstrap';

export default class StatsServices extends MasterServices {
    public getExp(level: number) {
        return Math.round(this.getAbsoluteExp(level + 1) - this.getAbsoluteExp(level));
    }

    protected getAbsoluteExp(a: number) {
        // see http://tibia.wikia.com/wiki/Experience_Formula
        return (50 / 3) * (a * a * a - 6 * a * a + 17 * a - 12);
    }

    public lvlUp(socket: GameSocket) {
        let stats = socket.character.stats;
        stats.lvl++;

        this.addHp(stats, 5);
        this.addMp(stats, 5);

        stats.hp.now = socket.maxHp;
        stats.mp.now = socket.maxMp;
    }

    public addHp(stats: Stats, hp: number) {
        stats.hp.total += hp;
    }
    public addMp(stats: Stats, mp: number) {
        stats.mp.total += mp;
    }

	public getHpAfterDamage(hp: number, dmg: number): number {
		return Math.max(0, Math.floor(hp - dmg));
    }

	public getMpAfterUsage(mpNow: number, mpToUse: number): number {
		return Math.max(0, mpNow - mpToUse);
    }

    public getRegenHp(socket: GameSocket): number {
        return Math.ceil(socket.maxHp * socket.getHpRegenModifier());
    }

    public getRegenMp(socket: GameSocket): number {
        return Math.ceil(socket.maxMp * socket.getMpRegenModifier());
    }
};
// cache computations
StatsServices.prototype.getExp = <any>_.memoize(StatsServices.prototype.getExp);

function getStatsServices(): StatsServices {
    return getServices("stats");
}

export function getLvlExpByChar(target: GameSocket): number {
    // TODO use a better formula...
    return target.character.stats.lvl * 20;
}

export function getExp(level: number): number {
    return getStatsServices().getExp(level);
}