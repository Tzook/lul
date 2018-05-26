import MasterServices from "../master/master.services";
import { getServices } from "../main/bootstrap";
import { getCharParty, getPartyMembersInMap } from "../party/party.services";
import roomsConfig from "../rooms/rooms.config";
import { getRoomInstance } from "../rooms/rooms.services";
import { pickRandomly } from "../drops/drops.services";
import { pickRandomIndexes } from "../utils/random";
import dungeonConfig from "./dungeon.config";
import { getIo } from "../socketio/socketio.router";
import { addBonusPerks, removeBonusPerks, modifyBonusPerks } from "../bonusPerks/bonusPerks.services";
import { joinObjects } from "../utils/objects";
import statsConfig from "../stats/stats.config";

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
    const timerId = setTimeout(() => finishDungeon(socket), dungeon.time);
    const runningDungeon: RUNNING_DUNGEON = {
        startTime: Date.now(),
        timerId,
        dungeon,
        currentStageIndex: -1,
        perksBonus: {},
        members: new Set(party.members),
    };
    dungeonServices.runningDungeons.set(party, runningDungeon);
    party.kickLocked = true;
    
    nextStage(socket);
}

export function getRunningDungeon(socket: GameSocket): RUNNING_DUNGEON|undefined {
    const dungeonServices = getDungeonServices();
    const party = getCharParty(socket);
    return dungeonServices.runningDungeons.get(party);
}

export function finishDungeon(socket: GameSocket, teleportOut: boolean = true) {
    const dungeonServices = getDungeonServices();
    const party = getCharParty(socket);
    const runningDungeon = getRunningDungeon(socket);
    clearTimeout(runningDungeon.timerId);
    dungeonServices.runningDungeons.delete(party);
    
    for (let memberSocket of getPartyMembersInMap(socket, true)) {
        removeFromDungeon(memberSocket, teleportOut);
    }
    party.kickLocked = false;
}

export function removeFromDungeon(memberSocket: GameSocket, teleportOut: boolean) {
    const runningDungeon = getRunningDungeon(memberSocket);

    if (runningDungeon.members.has(memberSocket.character.name) {
        modifyBonusPerks(memberSocket, () => {
            removeBonusPerks({perks: runningDungeon.perksBonus}, memberSocket);
        });
        runningDungeon.members.delete(memberSocket.character.name);
    }
    if (teleportOut) {
        memberSocket.emitter.emit(roomsConfig.SERVER_INNER.MOVE_TO_TOWN.name, {}, memberSocket);
    }
}

export function nextStage(socket: GameSocket) {
    const runningDungeon = getRunningDungeon(socket);
    runningDungeon.currentStageIndex++;
    const currentStage = runningDungeon.dungeon.stages[runningDungeon.currentStageIndex];

    if (!currentStage) {
        finishDungeon(socket);
    } else {
        const roomIndex = pickRandomly(currentStage.rooms);
        const room = getRoomInstance(currentStage.rooms[roomIndex].key);
        for (let memberSocket of getPartyMembersInMap(socket, true)) {
            if (memberSocket.alive) {
                // living members continue. dead ones are resurrected.
                memberSocket.emitter.emit(roomsConfig.SERVER_INNER.MOVE_ROOM.name, { room }, memberSocket);
            } else {
                memberSocket.emitter.emit(statsConfig.SERVER_GETS.RELEASE_DEATH.name, {}, memberSocket);
            }
        }
    
        if (currentStage.rewards.length > 0) {
            setBuffsPool(socket);
        }
    }
}

function setBuffsPool(socket: GameSocket) {
    const runningDungeon = getRunningDungeon(socket);
    const buffIndexes = pickRandomIndexes(runningDungeon.dungeon.perksPool, dungeonConfig.DUNGEON_OFFERED_BUFFS);
    runningDungeon.buffsPool = buffIndexes.map(index => runningDungeon.dungeon.perksPool[index]);
    getIo().to(socket.character.room).emit(dungeonConfig.CLIENT_GETS.DUNGEON_STAGE_BUFFS.name, {
        pool: runningDungeon.buffsPool
    });
}

export function pickDungeonBuff(socket: GameSocket, index: number) {
    const runningDungeon = getRunningDungeon(socket);

    for (let memberSocket of getPartyMembersInMap(socket, true)) {
        modifyBonusPerks(memberSocket, () => {
            addBonusPerks({perks: runningDungeon.buffsPool[index]}, memberSocket);
        });
    }
    runningDungeon.perksBonus = joinObjects(runningDungeon.perksBonus, runningDungeon.buffsPool[index]);
}