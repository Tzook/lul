
import MasterServices from '../master/master.services';
import * as _ from 'underscore';

export default class DropsServices extends MasterServices {
	public getRandomStack(min?: number, max?: number): number {
		return _.random(min || 1, max || 1);
	}
};