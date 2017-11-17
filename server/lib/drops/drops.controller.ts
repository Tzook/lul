
import MasterController from '../master/master.controller';
import DropsServices from './drops.services';

export default class DropsController extends MasterController {
    public isDropped(chance: number): boolean {
        return DropsServices.doesChanceWork(chance);
    }
};