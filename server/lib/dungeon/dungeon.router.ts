import SocketioRouterBase from '../socketio/socketio.router.base';
import { isBoss } from '../master/master.middleware';
import dungeonConfig from './dungeon.config';
import DungeonController from './dungeon.controller';
import { getDungeonInfo, startDungeon, getRunningDungeon, nextStage, pickDungeonBuff, removeFromDungeon, finishDungeon } from './dungeon.services';
import { getCharParty, isPartyLeader, getPartyMembersInMap } from '../party/party.services';
import { getMobsInRoom } from '../mobs/mobs.services';

export default class DungeonRouter extends SocketioRouterBase {
    protected controller: DungeonController;

	protected initRoutes(app) {
		app.post(dungeonConfig.ROUTES.GENERATE,
			isBoss,
			this.controller.generateDungeons.bind(this.controller));
	}

	[dungeonConfig.SERVER_GETS.DUNGEON_START.name](data, socket: GameSocket) {
		let dungeon = getDungeonInfo(data.key);
		if (!dungeon) {
			return this.sendError(data, socket, "Dungeon doesn't exist");
		}
		if (dungeon.beginRoom !== socket.character.room) {
			return this.sendError(data, socket, "Dungeon starts in another room", true, true);
		}
		const party = getCharParty(socket);
		if (!party) {
			return this.sendError(data, socket, `Dungeon is for parties only`, true, true);
		}
		if (!isPartyLeader(socket, party)) {
			return this.sendError(data, socket, `You are not the party leader`, true, true);
		}
		if (party.members.size !== dungeonConfig.DUNGEON_PARTY_SIZE) {
			return this.sendError(data, socket, `Dungeon is for a party of ${dungeonConfig.DUNGEON_PARTY_SIZE} people`, true, true);
		}
		const partyMembers = getPartyMembersInMap(socket);
		if (partyMembers.length !== dungeonConfig.DUNGEON_PARTY_SIZE) {
			return this.sendError(data, socket, `The party needs to be alive and in the same room`, true, true);
		}
		for (let memberSocket of partyMembers) {
			if (memberSocket.character.stats.lvl < dungeon.minLvl || memberSocket.character.stats.lvl > dungeon.maxLvl) {
				return this.sendError(data, socket, `Dungeon is for lvls ${dungeon.minLvl}-${dungeon.maxLvl}`, true, true);
			}
		}
		
		startDungeon(socket, dungeon);
    }
	
	[dungeonConfig.SERVER_GETS.DUNGEON_NEXT_STAGE.name](data, socket: GameSocket) {
		const runningDungeon = getRunningDungeon(socket);
		if (!runningDungeon) {
			return this.sendError(data, socket, `Must be in a dungeon`, true, true);
		}
		if (!isPartyLeader(socket, getCharParty(socket))) {
			return this.sendError(data, socket, `You are not the party leader`, true, true);
		}
		const roomMobs = getMobsInRoom(socket.character.room);
		if (roomMobs.size > 0) {
			return this.sendError(data, socket, `There are ${roomMobs.size} mobs remaining`, true, true);
		}

		nextStage(socket);
    }
	
	[dungeonConfig.SERVER_GETS.DUNGEON_PICK_BUFF.name](data, socket: GameSocket) {
		const runningDungeon = getRunningDungeon(socket);
		if (!runningDungeon) {
			return this.sendError(data, socket, `Must be in a dungeon`, true, true);
		}
		if (!isPartyLeader(socket, getCharParty(socket))) {
			return this.sendError(data, socket, `You are not the party leader`, true, true);
		}
		if (!runningDungeon.buffsPool) {
			return this.sendError(data, socket, `There are no buffs available`, true, true);
		}
		if (!runningDungeon.buffsPool[data.buff_index]) {
			return this.sendError(data, socket, `Must pick a buff out of the available buffs`, true, true);
		}

		pickDungeonBuff(socket, data.buff_index);
	}

	[dungeonConfig.SERVER_INNER.LEAVE_PARTY.name](data, socket: GameSocket) {
		this.leaving(socket, true);
	}

	[dungeonConfig.SERVER_INNER.MOVE_TO_TOWN.name](data, socket: GameSocket) {
		this.leaving(socket, false);
	}
	
	private leaving(socket: GameSocket, teleportOut: boolean) {
		const runningDungeon = getRunningDungeon(socket);
		if (runningDungeon) {
			if (runningDungeon.members.size === 1) {
				// last man in the dungeon
				finishDungeon(socket, teleportOut);
			} else {
				removeFromDungeon(socket, teleportOut);
			}
		}
	}
}