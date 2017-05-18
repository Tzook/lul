'use strict';
import MasterController from '../master/master.controller';
import * as _ from 'underscore';

const DROP_PRECISE = 10000;

export default class DropsController extends MasterController {
    public getItemId(socket: GameSocket, itemId: string): string {
        return `${socket.character.room}-${itemId}`;
    }

    public isDropped(chance: number): boolean {
        let rand = _.random(DROP_PRECISE);
        let rolled = rand * 100 / DROP_PRECISE;
        return chance >= rolled;
    }
};