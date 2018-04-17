import mobsConfig from "../mobs/mobs.config";
import combatConfig from "../combat/combat.config";

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
		"HUNT_MOB": {"name": "hunt_mob"},
		HURT_MOB: Object.assign({}, mobsConfig.SERVER_INNER.HURT_MOB),
		HEAL_CHAR: Object.assign({}, combatConfig.SERVER_INNER.HEAL_CHAR),
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
	},
	REQUIREMENT_PHASE: {
		PROGRESS: "InProgress",
		COMPLETED: "Completed",
		NOT_PROGRESS: "NotInProgress",
		NOT_COMPLETED: "NotCompleted"
	}
}