import MasterServices from "../master/master.services";
import { getServices } from "../main/bootstrap";
import { getCharParty, getPartyMembersInMap } from "../party/party.services";
import roomsConfig from "../rooms/rooms.config";
import { getRoomInstance } from "../rooms/rooms.services";
import { pickRandomly } from "../drops/drops.services";
import { pickRandomIndexes } from "../utils/random";
import dungeonConfig from "./dungeon.config";
import { getIo } from "../socketio/socketio.router";
import { addBonusPerks, removeBonusPerks } from "../bonusPerks/bonusPerks.services";
import { joinObjects } from "../utils/objects";

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
        perksBonus: {},
    };
    dungeonServices.runningDungeons.set(party, runningDungeon);
    
    nextStage(socket);
}

export function getRunningDungeon(socket: GameSocket): RUNNING_DUNGEON|undefined {
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

    for (let memberSocket of getPartyMembersInMap(socket)) {
        removeBonusPerks({perks: runningDungeon.perksBonus}, memberSocket);
    }
}

export function nextStage(socket: GameSocket) {
    const runningDungeon = getRunningDungeon(socket);
    runningDungeon.currentStageIndex++;
    const currentStage = runningDungeon.dungeon.stages[runningDungeon.currentStageIndex];

    let room;
    if (!currentStage) {
        room = runningDungeon.dungeon.beginRoom;
    } else {
        const roomIndex = pickRandomly(currentStage.rooms);
        room = getRoomInstance(currentStage.rooms[roomIndex].key);
    }

    for (let memberSocket of getPartyMembersInMap(socket)) {
        socket.emitter.emit(roomsConfig.SERVER_INNER.MOVE_ROOM.name, {
            room
        }, memberSocket);
    }

    if (currentStage.rewards.length > 0) {
        const buffIndexes = pickRandomIndexes(runningDungeon.dungeon.perksPool, dungeonConfig.DUNGEON_OFFERED_BUFFS);
        runningDungeon.buffsPool = buffIndexes.map(index => runningDungeon.dungeon.perksPool[index]);
        getIo().to(socket.character.room).emit(dungeonConfig.CLIENT_GETS.DUNGEON_STAGE_BUFFS.name, {
            pool: runningDungeon.buffsPool
        });
    }
}

export function pickDungeonBuff(socket: GameSocket, index: number) {
    const runningDungeon = getRunningDungeon(socket);

    for (let memberSocket of getPartyMembersInMap(socket)) {
        addBonusPerks({perks: runningDungeon.buffsPool[index]}, memberSocket);
    }
    runningDungeon.perksBonus = joinObjects(runningDungeon.perksBonus, runningDungeon.buffsPool[index]);
}