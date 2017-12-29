
import MasterServices from '../master/master.services';
import ItemsRouter from '../items/items.router';
import EquipsMiddleware from './equips.middleware';
import SocketioRouter from '../socketio/socketio.router';
import { EQUIPS_SCHEMA } from './equips.model';

export default class EquipsServices extends MasterServices {
    protected itemsRouter: ItemsRouter;
    protected middleware: EquipsMiddleware;
    protected socketioRouter: SocketioRouter;

	init(files, app) {
		super.init(files, app);
        this.middleware = files.middleware;
		this.itemsRouter = files.routers.items;
		this.socketioRouter = files.routers.socketio;
	}

    public beginEquips(items: {key: string}[]): Promise<any> {
		console.log("Generating begin equips from data:", items);
		
		let equips: BeginEquips = {};

        for (let i = 0; i < (items || []).length; i++) {
            let itemKey = items[i] && items[i].key;
			let itemInfo = this.itemsRouter.getItemInfo(itemKey);
            if (!itemInfo) {
                return Promise.reject(`Item ${itemKey} does not exist.`);
            }
            if (equips[itemInfo.type]) {
                return Promise.reject(`Item type ${itemInfo.type} was provided more than once: ${equips[itemInfo.type]} and ${itemKey}.`);
            }
            if (!this.middleware.isValidEquipItem(itemInfo)) {
                return Promise.reject(`Item ${itemKey} is not an equip.`);
            }
            equips[itemInfo.type] = itemKey;
        }

		return Promise.resolve()
			.then(() => {
                let config = this.socketioRouter.getConfig();
                config.beginEquips = equips;
                return config.save();
            });
    }
    
	public clearInvalidEquips(socket: GameSocket) {
		let equips = socket.character.equips;
		for (let type in EQUIPS_SCHEMA) {
			let equip = equips[type];
			if (this.middleware.isItem(equip) && !this.itemsRouter.getItemInfo(equip.key)) {
				this.deleteEquip(socket, type);
			}	
		}
	}

    public deleteEquip(socket: GameSocket, slot: string) {
        socket.character.equips[slot] = {};
    }
};