import roomsConfig from "../rooms/rooms.config";

export default {
	GLOBAL_EVENTS: {
	},
    SERVER_INNER: {
		LEFT_ROOM: Object.assign({}, roomsConfig.SERVER_INNER.LEFT_ROOM, {log: false}),
	},
	SERVER_GETS: {
        ENTERED_ROOM: Object.assign({}, roomsConfig.SERVER_GETS.ENTERED_ROOM, {log: false}),
		SECONDARY_MODE_START: {name: "secondary_mode_started", alive: true, log: true},
		SECONDARY_MODE_HIT: {name: "secondary_mode_hit", alive: true, log: true},
		SECONDARY_MODE_END: {name: "secondary_mode_ended", log: true},
	},
	CLIENT_GETS: {
		SECONDARY_MODE_START: {name: "actor_start_secondary_mode" },
		SECONDARY_MODE_END: {name: "actor_end_secondary_mode" },
    },
}