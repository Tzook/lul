'use strict';
import MasterController from '../master/master.controller';
import ItemsServices from './items.services';

export default class ItemsController extends MasterController {
    protected services: ItemsServices;
    private io: SocketIO.Namespace;

	public setIo(io) {
		this.io = io;
	}

    public getItemId(socket: GameSocket, itemId: string): string {
        return `${socket.character.room}-${itemId}`;
    }
    
    // HTTP functions
	// =================
	public generateItems(req, res, next) {
        this.services.generateItems(req.body.items)
			.then(d => {
				this.sendData(res, this.LOGS.GENERATE_ITEMS, d);
			})
			.catch(e => {
				this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "generateItems", file: "items.controller.js"});
			});
    }

	public warmItemsInfo(): void {
		this.services.getItems()
			.catch(e => {
				console.error("Had an error getting items from the db!");
				throw e;
			});
	}
};