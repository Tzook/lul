import SocketioRouterBase from '../socketio/socketio.router.base';
import UseMiddleware from './use.middleware';
import config from '../use/use.config';
import itemsConfig from '../items/items.config';
import statsConfig from '../stats/stats.config';

export default class UseRouter extends SocketioRouterBase {
	protected middleware: UseMiddleware;

	[config.SERVER_INNER.ITEM_USE.name](data: {itemSlot: number, itemInfo: ITEM_MODEL}, socket: GameSocket) {
		let {itemSlot, itemInfo} = data;
		if (this.middleware.isUseItem(itemInfo)) {
			this.emitter.emit(itemsConfig.SERVER_INNER.ITEM_REMOVE.name, {
				item: { stack: 1, key: itemInfo.key },
				slot: itemSlot,
			}, socket);

			let {hp, mp} = itemInfo.use;

			if (hp) {
				this.emitter.emit(statsConfig.SERVER_INNER.GAIN_HP.name, { hp }, socket);
			}

			if (mp) {
				this.emitter.emit(statsConfig.SERVER_INNER.GAIN_MP.name, { mp }, socket);
			}
		}
	}
};
