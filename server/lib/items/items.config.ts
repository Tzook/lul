export default {
	"ROUTES": {
		"GENERATE": "/items/generate"
	},
	"LOGS": {
		"GENERATE_ITEMS": {
			"MSG": "Generated items successfully.",
			"CODE": "ITEM_1",
			"STATUS": "OK"
		},
		"INVENTORY_FULL": {
			"MSG": "No inventory slots!"
		}
	},
	"SERVER_INNER": {
		"ITEM_REMOVE": {"name": "remove_item"},
		"ITEM_PICK": {"name": "picked_item_inner"},
		"ITEM_ADD": {"name": "add_item"},
		"ITEM_USE": {"name": "used_actual_item"},
	},
	"SERVER_GETS": {
		"ITEM_DROP": {"name": "dropped_item", "alive": true, "log": true},
		"ITEM_MOVE": {"name": "moved_item", "alive": true, "log": true},
		"ITEM_USE": {"name": "used_item", "alive": true, "log": true},
	},
	"CLIENT_GETS": {
		"ITEM_DELETE": {"name": "actor_delete_item"},
		"ITEM_MOVE": {"name": "actor_move_item"},
		"ITEM_ADD": {"name": "actor_add_item"}
	},
	GLOBAL_ITEMS_READY: {"name": "items_ready"},
	"MAX_ITEMS": 20
}