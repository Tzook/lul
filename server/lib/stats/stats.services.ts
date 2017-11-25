
import MasterServices from '../master/master.services';
import config from './stats.config';
import * as _ from 'underscore';

export default class StatsServices extends MasterServices {
    public magToMp(mag: number) {
        return mag * config.MAG_TO_MP_RATIO;
    }

    public strToHp(str: number) {
        return str * config.STR_TO_HP_RATIO;
    }

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

        let str, dex, mag;
        str = dex = mag = config.LEVEL_UP_STAT_BONUS;
        this.addStr(stats, str);
        this.addMag(stats, mag);
        this.addDex(stats, dex);
        stats.hp.now = socket.maxHp;
        stats.mp.now = socket.maxMp;

        console.log("Level up", stats);
    }

    public addStr(stats: Stats, str: number) {
        stats.str += str;
        this.addHp(stats, this.strToHp(str));
    }
    public addMag(stats: Stats, mag: number) {
        stats.mag += mag;
        this.addMp(stats, this.magToMp(mag));
    }
    public addDex(stats: Stats, dex: number) {
        stats.dex += dex;
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
    
    public static getMainStat(socket: GameSocket): string {
        return socket.character.stats.primaryAbility === "range" ? "dex" : "str";
    }

    public static hasAbility(socket: GameSocket, ability: string): boolean {
        return (<any>socket.character.stats.abilities).includes(ability);
    }
};
// cache computations
StatsServices.prototype.getExp = <any>_.memoize(StatsServices.prototype.getExp);