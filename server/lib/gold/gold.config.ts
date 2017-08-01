import itemsConfig from "../items/items.config";
export default {
	"SERVER_INNER": {
        "ITEM_REMOVE": Object.assign({}, itemsConfig.SERVER_INNER.ITEM_REMOVE),
        "ITEM_PICK": Object.assign({}, itemsConfig.SERVER_INNER.ITEM_PICK),
		"ITEM_ADD": Object.assign({}, itemsConfig.SERVER_INNER.ITEM_ADD),
	},
	"SERVER_GETS": {
		"DROP_GOLD": {"name": "dropped_gold", "throttle": 1000, "alive": true}
	},
	"CLIENT_GETS": {
		"CHANGE_GOLD": {"name": "change_gold_amount"}
	}
}