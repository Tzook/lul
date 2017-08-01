import itemsConfig from "../items/items.config";
export default {
	"SERVER_INNER": {
		"ITEM_REMOVE": Object.assign({}, itemsConfig.SERVER_INNER.ITEM_REMOVE),
        "ITEM_PICK": Object.assign({}, itemsConfig.SERVER_INNER.ITEM_PICK),
		"ITEM_ADD": Object.assign({}, itemsConfig.SERVER_INNER.ITEM_ADD),
	},
	"SERVER_GETS": {
		"MISC_DROP": {"name": "dropped_misc", "alive": true}
	},
	"CLIENT_GETS": {
		"STACK_CHANGE": {"name": "change_item_stack"}
	}
}