import MasterServices from "../master/master.services";
import { getServices } from "../main/bootstrap";
import { getSetOfMap } from "../utils/maps";

export default class SecondaryServices extends MasterServices {
    // room id -> sockets
    public secondaryModes: Map<string, Set<GameSocket>> = new Map();
}

export function getSecondaryServices(): SecondaryServices {
    return getServices("secondary");
}

export function setSecondaryMode(socket: GameSocket) {
    getRoomSecondaryModes(socket, true).add(socket);
}

export function deleteSecondaryMode(socket: GameSocket) {
    const roomSecondaries = getRoomSecondaryModes(socket);
    if (roomSecondaries.has(socket)) {
        roomSecondaries.delete(socket);
        if (roomSecondaries.size === 0) {
            getSecondaryServices().secondaryModes.delete(socket.character.room);
        }
    }
}

export function getSecondaryMode(socket: GameSocket): boolean {
    return getRoomSecondaryModes(socket).has(socket);
}

export function getRoomSecondaryModes(socket: GameSocket, createIfMissing: boolean = false): Set<GameSocket> {
    return getSetOfMap(getSecondaryServices().secondaryModes, socket.character.room);
}