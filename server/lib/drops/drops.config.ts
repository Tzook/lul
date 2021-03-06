export default {
	"SERVER_INNER": {
		"ITEMS_DROP": {"name": "items_drop"},
		"GENERATE_DROPS": {"name": "generate_drops"}
	},
	"SERVER_GETS": {
		"ITEM_PICK": {"name": "picked_item", "throttle": 0, "alive": true},
		"ENTERED_ROOM": {"name": "entered_room"},
		"ITEMS_LOCATIONS": {"name": "items_locations", "bitch": true}
	},
	"CLIENT_GETS": {
		"ITEM_PICK": {"name": "actor_pick_item"},
		"ITEMS_DROP": {"name": "drop_items"},
		"ITEM_DISAPPEAR": {"name": "item_disappear"},
		"ITEMS_LOCATIONS": {"name": "items_locations"},
		"ITEM_OWNER_GONE": {"name": "item_owner_gone"}
	},
	"ITEM_DROP_LIFE_TIME": 60000,
	"ITEM_DROP_OWN_TIME": 15000
}