import MasterServices from '../master/master.services';

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
        let state = this.roomStates.get(room);
        if (!state) {
            state = new Map();
            if (createIfMissing) {
                this.roomStates.set(room, state);
            }
        }
        return state;
    }
};