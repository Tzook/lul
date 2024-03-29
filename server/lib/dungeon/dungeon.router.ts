import { isBoss } from "../master/master.middleware";
import { getMobsInRoom } from "../mobs/mobs.services";
import { createParty, getCharParty, getPartyMembersInMap, isPartyLeader } from "../party/party.services";
import roomsConfig from "../rooms/rooms.config";
import SocketioRouterBase from "../socketio/socketio.router.base";
import dungeonConfig from "./dungeon.config";
import DungeonController from "./dungeon.controller";
import {
    finishDungeon,
    getCurrentDungeonRoom,
    getDungeonInfo,
    getRunningDungeon,
    nextStage,
    pickDungeonBuff,
    removeFromDungeon,
    startDungeon,
    unlockDungeonReward,
} from "./dungeon.services";

export default class DungeonRouter extends SocketioRouterBase {
    protected controller: DungeonController;

    protected initRoutes(app) {
        app.post(dungeonConfig.ROUTES.GENERATE, isBoss, this.controller.generateDungeons.bind(this.controller));
    }

    [dungeonConfig.SERVER_GETS.DUNGEON_START.name](data, socket: GameSocket) {
        let dungeon = getDungeonInfo(data.key);
        if (!dungeon) {
            return this.sendError(data, socket, "Dungeon doesn't exist");
        }
        if (dungeon.beginRoom !== socket.character.room) {
            return this.sendError(data, socket, "Dungeon starts in another room", true, true);
        }
        let party = getCharParty(socket);
        if (!party) {
            party = createParty(socket);
        }
        if (!isPartyLeader(socket, party)) {
            return this.sendError(data, socket, `You are not the party leader`, true, true);
        }
        const partyMembers = getPartyMembersInMap(socket);
        if (partyMembers.length > dungeonConfig.DUNGEON_PARTY_SIZE) {
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
        if (getCurrentDungeonRoom(socket).time) {
            return this.sendError(data, socket, `Room is limited by time - cannot finish it manually`, true, true);
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
        if (!runningDungeon.buffsPool) {
            return this.sendError(data, socket, `There are no buffs available`, true, true);
        }
        if (!runningDungeon.buffsPool[data.buff_index]) {
            return this.sendError(data, socket, `Must pick a buff out of the available buffs`, true, true);
        }

        pickDungeonBuff(socket, data.buff_index);
    }

    [dungeonConfig.SERVER_GETS.DUNGEON_UNLOCK_REWARD.name](data, socket: GameSocket) {
        const runningDungeon = getRunningDungeon(socket);
        if (!runningDungeon) {
            return this.sendError(data, socket, `Must be in a dungeon`, true, true);
        }
        if (!runningDungeon.haveRewards.has(socket.character.name)) {
            return this.sendError(data, socket, `No reward available`, true, true);
        }

        unlockDungeonReward(socket);
    }

    [dungeonConfig.SERVER_GETS.LEAVE_PARTY.name](data, socket: GameSocket) {
        const runningDungeon = getRunningDungeon(socket);
        if (runningDungeon) {
            this.emitter.emit(roomsConfig.SERVER_INNER.MOVE_TO_TOWN.name, {}, socket);
        }
    }

    [dungeonConfig.SERVER_INNER.MOVE_TO_TOWN.name](data, socket: GameSocket) {
        const runningDungeon = getRunningDungeon(socket);
        if (runningDungeon) {
            if (runningDungeon.members.size === 1) {
                // last man in the dungeon
                finishDungeon(socket, false);
            } else {
                removeFromDungeon(socket, false);
            }
        }
    }
}
