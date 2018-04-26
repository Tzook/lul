import MasterServices from '../master/master.services';
import { getMapOfMap } from '../utils/maps';

const MAX_STATE_SIZE = 100;
export default class StateServices extends MasterServices {
    private roomStates: Map<string, ROOM_STATE> = new Map();

    public updateRoomState(room: string, key: string, value: string): boolean {
        let roomState = this.getStateObject(room, true);

        let canModifyState = roomState.has(key) || roomState.size <= MAX_STATE_SIZE;
        if (canModifyState) {
            roomState.set(key, value);
        }
        return canModifyState;
    }

    public getRoomState(room: string): ROOM_STATE {
        return this.getStateObject(room, false);
    }

    public clearRoomState(room: string) {
        this.roomStates.delete(room);
    }

    protected getStateObject(room: string, createIfMissing: boolean): ROOM_STATE {
		return getMapOfMap(this.roomStates, room, createIfMissing);        
    }
};

export function updateCharVar(socket: GameSocket, key: string, value: CHAR_VAR|undefined): boolean {
    let charVars = socket.character.vars;
    // TODO check if allowed to add more fields
    let canModifyVars = true;
    if (canModifyVars) {
        if (value) {
            charVars[key] = isNaN(value) ? value : +value;
        } else {
            charVars[key] = charVars[key] || 0;
            if (isNaN(charVars[key])) {
                canModifyVars = false;
            } else {
                charVars[key]++;
            }
        }
    }
    if (canModifyVars) {
        socket.character.markModified("vars");
    }
    return canModifyVars;
}