export default {
	"ROUTES": {
		"GENERATE": "/quests/generate"
	},
	"LOGS": {
		"GENERATE": {
			"MSG": "Generated quests successfully.",
			"CODE": "QUEST_1",
			"STATUS": "OK"
		}
	},
	"SERVER_INNER": {
		"HUNT_MOB": {"name": "hunt_mob"}
	},
	"SERVER_GETS": {
		"QUEST_START": {"name": "quest_started", "alive": true, "log": true},
		"QUEST_DONE": {"name": "quest_completed", "alive": true, "log": true},
		"QUEST_OK_PROGRESS": {"name": "quest_ok_progress", "alive": true, "log": true},
		"QUEST_ABORT": {"name": "quest_aborted", "alive": true, "log": true}
	},
	"CLIENT_GETS": {
		"QUEST_START": {"name": "quest_start"},
		"QUEST_DONE": {"name": "quest_complete"},
		"QUEST_ABORT": {"name": "quest_abort"},
		"QUEST_OK_PROGRESS": {"name": "quest_ok_progress"},
		"QUEST_HUNT_PROGRESS": {"name": "quest_hunt_progress"}
	}
}