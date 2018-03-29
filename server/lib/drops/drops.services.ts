
import MasterServices from '../master/master.services';
import * as _ from 'underscore';

const CHANCE_PRECISE = 10000;

export default class DropsServices extends MasterServices {
	public getRandomStack(min?: number, max?: number): number {
		return _.random(min || 1, max || 1);
	}
};

export function doesChanceWorkFloat(chance: number): boolean {
    return doesChanceWork(chance * 100);
}

export function doesChanceWork(chance: number): boolean {
    let rand = _.random(CHANCE_PRECISE);
    let rolled = rand * 100 / CHANCE_PRECISE;
    return chance >= rolled;
}

export function pickRandomly(list: {chance: number}[]|{[key: string]: {chance: number}}): string|number|null {
    let sum = 0;
    const random = Math.random();
    for (let key in list) {
        let {chance} = list[key];
        sum += chance;
        if (random <= sum) {
            return key;
        }
    }

    return null;
}