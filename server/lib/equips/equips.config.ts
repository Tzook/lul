import itemsConfig from "../items/items.config";

export default {
	"ROUTES": {
		"BEGIN": "/equips/begin"
	},
	"LOGS": {
		"BEGIN_EQUIPS": {
			"MSG": "New chars will begin with the equips.",
			"CODE": "EQUIP_1",
			"STATUS": "OK"
		}
	},
	"SERVER_INNER": {
		"ITEM_USE": Object.assign({}, itemsConfig.SERVER_INNER.ITEM_USE)
	},
	"SERVER_GETS": {
		"EQUIP_ITEM": {"name": "equipped_item", "alive": true, "log": true},
		"UNEQUIP_ITEM": {"name": "unequipped_item", "alive": true, "log": true},
		"DROP_EQUIP": {"name": "dropped_equip", "alive": true, "log": true},
		"USE_EQUIP": {"name": "used_equip", "alive": true, "log": true}
	},
	"CLIENT_GETS": {
		"EQUIP_ITEM": {"name": "actor_equip_item"},
		"UNEQUIP_ITEM": {"name": "actor_unequip_item"},
		"DELETE_EQUIP": {"name": "actor_delete_equip"}
	}
}