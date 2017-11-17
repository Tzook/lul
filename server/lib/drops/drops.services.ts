
import MasterServices from '../master/master.services';
import * as _ from 'underscore';

const CHANCE_PRECISE = 10000;

export default class DropsServices extends MasterServices {
	public getRandomStack(min?: number, max?: number): number {
		return _.random(min || 1, max || 1);
	}

	public static doesChanceWorkFloat(chance: number): boolean {
        return DropsServices.doesChanceWork(chance * 100);
    }

	public static doesChanceWork(chance: number): boolean {
        let rand = _.random(CHANCE_PRECISE);
        let rolled = rand * 100 / CHANCE_PRECISE;
        return chance >= rolled;
    }
};