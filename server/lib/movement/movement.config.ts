export default {
	"SERVER_GETS": {
		"MOVEMENT": {"name": "movement", "throttle": 0},
		"START_CLIMB": {"name": "started_climbing", "throttle": 0, "alive": true},
		"STOP_CLIMB": {"name": "stopped_climbing", "throttle": 0, "alive": true}
	},
	"CLIENT_GETS": {
		"MOVEMENT": {"name": "movement"},
		"START_CLIMB": {"name": "actor_start_climbing"},
		"STOP_CLIMB": {"name": "actor_stop_climbing"}
	}
}