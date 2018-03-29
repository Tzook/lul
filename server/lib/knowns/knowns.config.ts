import socketioConfig from '../socketio/socketio.config';
import roomsConfig from '../rooms/rooms.config';
import statsConfig from '../stats/stats.config';

export default {
    SERVER_INNER: {
        MOVE_ROOM: Object.assign({}, roomsConfig.SERVER_INNER.MOVE_ROOM),
        GAIN_LVL: Object.assign({log: false}, statsConfig.SERVER_INNER.GAIN_LVL),
        UPDATE_KNOWN: {"name": "update_known"},
    },
	SERVER_GETS: {
		DISCONNECT: Object.assign({}, socketioConfig.SERVER_GETS.DISCONNECT)
	},
	CLIENT_GETS: {
		KNOWN_LOGOUT: {"name": "known_logout"},
		KNOWN_LOGIN: {"name": "known_login"},
		KNOWN_MOVE_ROOM: {"name": "known_move_room"},
		KNOWN_INFO: {"name": "known_info"}
	}
}