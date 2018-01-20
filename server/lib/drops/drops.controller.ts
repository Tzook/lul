
import MasterController from '../master/master.controller';
import { doesChanceWorkFloat } from './drops.services';

export default class DropsController extends MasterController {
    public isDropped(chance: number): boolean {
        return doesChanceWorkFloat(chance);
    }
};