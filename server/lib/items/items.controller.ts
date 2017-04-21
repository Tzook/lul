'use strict';
import MasterController from '../master/master.controller';

export default class ItemsController extends MasterController {
    public getItemId(socket: GameSocket, itemId: string): string {
        return `${socket.character.room}-${itemId}`;
    }
};