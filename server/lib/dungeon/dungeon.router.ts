import SocketioRouterBase from '../socketio/socketio.router.base';
import { isBoss } from '../master/master.middleware';
import dungeonConfig from './dungeon.config';
import DungeonController from './dungeon.controller';
import { getDungeonInfo, startDungeon } from './dungeon.services';
import { getCharParty, isPartyLeader, getPartyMembersInMap } from '../party/party.services';

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
			return this.sendError(data, socket, "Dungeon doesn't exist!");
		}
		if (dungeon.beginRoom !== socket.character.room) {
			return this.sendError(data, socket, "Dungeon starts in another room!", true, true);
		}
		const party = getCharParty(socket);
		if (!party) {
			return this.sendError(data, socket, `Dungeon is for parties only!`, true, true);
		}
		if (!isPartyLeader(socket, party)) {
			return this.sendError(data, socket, `You are not the party leader`, true, true);
		}
		if (party.members.size !== dungeonConfig.DUNGEON_PARTY_SIZE) {
			return this.sendError(data, socket, `Dungeon is for a party of ${dungeonConfig.DUNGEON_PARTY_SIZE} people!`, true, true);
		}
		const partyMembers = getPartyMembersInMap(socket);
		if (partyMembers.length !== dungeonConfig.DUNGEON_PARTY_SIZE) {
			return this.sendError(data, socket, `The party needs to be alive and in the same room!`, true, true);
		}
		for (let memberSocket of partyMembers) {
			if (memberSocket.character.stats.lvl < dungeon.minLvl || memberSocket.character.stats.lvl > dungeon.maxLvl) {
				return this.sendError(data, socket, `Dungeon is for lvls ${dungeon.minLvl}-${dungeon.maxLvl}!`, true, true);
			}
		}
		
		startDungeon(socket, dungeon);
    }
}