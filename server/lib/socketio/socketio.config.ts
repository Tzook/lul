export default {
	"ROUTES": {
		"BEGIN_CONNECTION": "connection",
		"RESTART": "/restart"
	},
	"SERVER_GETS": {
		"DISCONNECT": {"name": "disconnect"}
	},
	"CLIENT_GETS": {
		"EVENT_ERROR": {"name": "event_error"}
	},
	GLOBAL_CONFIG_READY: {"name": "config_ready"},
	"EVENTS_THROTTLE": 100,
	SAVE_INTERVAL: 10000,
}