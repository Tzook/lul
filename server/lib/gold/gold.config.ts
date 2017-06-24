export default {
	"SERVER_INNER": {
		"ITEM_REMOVE": {"name": "remove_item"},
		"ITEM_ADD": {"name": "add_item"}
	},
	"SERVER_GETS": {
		"ITEM_PICK": {"name": "picked_item", "throttle": 0, "alive": true},
		"DROP_GOLD": {"name": "dropped_gold", "throttle": 1000, "alive": true}
	},
	"CLIENT_GETS": {
		"CHANGE_GOLD": {"name": "change_gold_amount"}
	}
}