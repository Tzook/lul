
import MasterServices from '../master/master.services';
import * as _ from 'underscore';

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
        return socket.maxHp * socket.getHpRegenModifier() | 0;
    }

    public getRegenMp(socket: GameSocket): number {
        return socket.maxMp * socket.getMpRegenModifier() | 0;
    }
};
// cache computations
StatsServices.prototype.getExp = <any>_.memoize(StatsServices.prototype.getExp);