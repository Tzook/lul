import MasterServices from "../master/master.services";
import { getServices } from "../main/bootstrap";
import { getCharParty, getPartyMembersInMap } from "../party/party.services";
import roomsConfig from "../rooms/rooms.config";
import { getRoomInstance } from "../rooms/rooms.services";

export default class DungeonServices extends MasterServices {
    public dungeonsInfo: Map<string, DUNGEON> = new Map(); 
    public runningDungeons: Map<PARTY_MODEL, RUNNING_DUNGEON> = new Map();   
}

// Dungeon service handling
// ==========================
export function getDungeonServices(): DungeonServices {
    return getServices("dungeon");
}

export function setDungeonsInfo(dungeons: DUNGEON[]) {
    const dungeonServices = getDungeonServices();
    dungeons.forEach(dungeon => {
        dungeonServices.dungeonsInfo.set(dungeon.key, dungeon);
    });
}

export function getDungeonInfo(key: string): DUNGEON|undefined {
    const dungeonServices = getDungeonServices();
    return dungeonServices.dungeonsInfo.get(key);
}

// Dungeon run handling
// ==========================
export function startDungeon(socket: GameSocket, dungeon: DUNGEON) {
    const dungeonServices = getDungeonServices();
    const party = getCharParty(socket);
    const timerId = setTimeout(() => abortDungeon(socket), dungeon.time);
    const runningDungeon: RUNNING_DUNGEON = {
        startTime: Date.now(),
        timerId,
        dungeon,
        currentStageIndex: -1,
    };
    dungeonServices.runningDungeons.set(party, runningDungeon);
    
    nextStage(socket);
}

function getRunningDungeon(socket: GameSocket): RUNNING_DUNGEON {
    const dungeonServices = getDungeonServices();
    const party = getCharParty(socket);
    return dungeonServices.runningDungeons.get(party);
}

export function abortDungeon(socket: GameSocket) {
    const dungeonServices = getDungeonServices();
    const party = getCharParty(socket);
    const runningDungeon = dungeonServices.runningDungeons.get(party);
    clearTimeout(runningDungeon.timerId);
    dungeonServices.runningDungeons.delete(party);
}

function nextStage(socket: GameSocket) {
    const runningDungeon = getRunningDungeon(socket);
    runningDungeon.currentStageIndex++;
    
    let room;
    if (runningDungeon.currentStageIndex > runningDungeon.dungeon.stages.length) {
        room = runningDungeon.dungeon.beginRoom;
    } else {
        room = getRoomInstance("TODO");
    }

    for (let moveSocket of getPartyMembersInMap(socket)) {
        socket.emitter.emit(roomsConfig.SERVER_INNER.MOVE_ROOM.name, {
            room
        }, moveSocket);
    }
}