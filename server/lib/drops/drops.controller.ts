
import MasterController from '../master/master.controller';
import { doesChanceWork } from './drops.services';

export default class DropsController extends MasterController {
    public isDropped(chance: number): boolean {
        return doesChanceWork(chance);
    }
};