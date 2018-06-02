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
import { getItemInstance } from "../items/items.services";
import dropsConfig from "../drops/drops.config";

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
        currentRoomIndex: -1,
        perksBonus: {},
        members: new Set(party.members),
        haveRewards: new Set(),
        poc: socket,
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
    const runningDungeon = getRunningDungeon(socket);
    if (runningDungeon.finished) {
        return;
    }
    runningDungeon.finished = true;
    clearTimeout(runningDungeon.timerId);
    clearTimeout(runningDungeon.roomTimerId);
    
    for (let memberSocket of getPartyMembersInMap(socket, true)) {
        removeFromDungeon(memberSocket, teleportOut);
    }
    // cleanup
    const dungeonServices = getDungeonServices();
    const party = getCharParty(socket);
    party.kickLocked = false;
    dungeonServices.runningDungeons.delete(party);
}

export function removeFromDungeon(memberSocket: GameSocket, teleportOut: boolean) {
    const runningDungeon = getRunningDungeon(memberSocket);

    if (runningDungeon.members.has(memberSocket.character.name)) {
        modifyBonusPerks(memberSocket, () => {
            removeBonusPerks({perks: runningDungeon.perksBonus}, memberSocket);
        });
        runningDungeon.members.delete(memberSocket.character.name);
        if (memberSocket === runningDungeon.poc && runningDungeon.members.size > 0) {
            const newPoc = Array.from(runningDungeon.members)[0];
            runningDungeon.poc = memberSocket.map.get(newPoc);
        }
    }
    if (teleportOut) {
        memberSocket.emitter.emit(roomsConfig.SERVER_INNER.MOVE_TO_TOWN.name, {}, memberSocket);
    }
}

export function getCurrentDungeonStage(socket: GameSocket): DUNGEON_STAGE {
    const runningDungeon = getRunningDungeon(socket);
    return runningDungeon.dungeon.stages[runningDungeon.currentStageIndex];    
}

export function getCurrentDungeonRoom(socket: GameSocket): DUNGEON_ROOM {
    const runningDungeon = getRunningDungeon(socket);
    const currentStage = getCurrentDungeonStage(socket);
    return currentStage.rooms[runningDungeon.currentRoomIndex];
}

export function nextStage(socket: GameSocket) {
    const runningDungeon = getRunningDungeon(socket);
    runningDungeon.currentStageIndex++;
    const currentStage = getCurrentDungeonStage(socket);

    if (!currentStage) {
        finishDungeon(socket);
    } else {
        runningDungeon.currentRoomIndex = <number>pickRandomly(currentStage.rooms);
        const currentRoom = getCurrentDungeonRoom(socket);
        const room = getRoomInstance(currentRoom.key);
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
            runningDungeon.haveRewards = new Set(runningDungeon.members);
        } else {
            runningDungeon.haveRewards.clear();
        }

        if (currentRoom.time) {
            runningDungeon.roomTimerId = setTimeout(() => nextStage(runningDungeon.poc), currentRoom.time);
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

export function unlockDungeonReward(socket: GameSocket) {
    const runningDungeon = getRunningDungeon(socket);
    runningDungeon.haveRewards.delete(socket.character.name);

    const possibleRewards = getCurrentDungeonStage(socket).rewards;
    const pickedIndex = pickRandomly(possibleRewards);
    const reward: DUNGEON_REWARD = possibleRewards[pickedIndex];
    
    let itemInstance = getItemInstance(reward.key);
    if (!itemInstance) {
        throw new Error(`Item ${reward.key} does not exist in dungeon stage ${runningDungeon.currentStageIndex}`);
    }
                
    if (reward.stack > 1) {
        itemInstance.stack = reward.stack;
    }
    
    socket.emitter.emit(dropsConfig.SERVER_INNER.ITEMS_DROP.name, {
        owner: socket.character.name,
        partyLoot: false
    }, socket, [itemInstance]);
}