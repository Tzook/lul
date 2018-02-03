import roomsConfig from "../rooms/rooms.config";

export default {
    SERVER_INNER: {
        LEFT_ROOM: Object.assign({}, roomsConfig.SERVER_INNER.LEFT_ROOM, {log: false}),
    },
	"SERVER_GETS": {
        ENTERED_ROOM: Object.assign({}, roomsConfig.SERVER_GETS.ENTERED_ROOM, {log: false}),
        "UPDATE_ROOM_STATE": {"name": "update_room_state", "log": true},
	},
	"CLIENT_GETS": {
		"ROOM_STATE": {"name": "room_state"},
	},
};