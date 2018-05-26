import partyConfig from "../party/party.config";
import roomsConfig from "../rooms/rooms.config";

export default {
	ROUTES: {
		GENERATE: "/dungeons/generate"
	},
	LOGS: {
		GENERATE_DUNGEONS: {
			MSG: "Generated dungeon successfully.",
			CODE: "DUNGEON_1",
			STATUS: "OK"
		}
	},
	SERVER_INNER: {
		LEAVE_PARTY: Object.assign({}, partyConfig.SERVER_GETS.LEAVE_PARTY, {log: false}),		
        MOVE_TO_TOWN: Object.assign({}, roomsConfig.SERVER_INNER.MOVE_TO_TOWN, {log: false}),
	},
	SERVER_GETS: {
		DUNGEON_START: {name: "started_dungeon", "alive": true, "log": true},		
		DUNGEON_NEXT_STAGE: {name: "continued_dungeon", "alive": true, "log": true},		
		DUNGEON_PICK_BUFF: {name: "picked_dungeon_buff", "alive": true, "log": true},		
		DUNGEON_UNLOCK_REWARD: {name: "unlocked_dungeon_reward", "alive": true, "log": true},		
	},
	CLIENT_GETS: {
		DUNGEON_STAGE_BUFFS: {name: "dungeon_buffs_pool"},
	},
	DUNGEON_PARTY_SIZE: 5,
	DUNGEON_RARE_ROOM_RARITY: 3,
	DUNGEON_OFFERED_BUFFS: 3,
}