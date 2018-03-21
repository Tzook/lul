
import MasterServices from '../master/master.services';
import * as _ from "underscore";
import { extendStatsWithMax } from '../rooms/rooms.middleware';

export default class KnownsServices extends MasterServices {
    public getLoggedInKnownsFromList(socket: GameSocket, validator: (knownSocket: GameSocket) => boolean = _.constant(true)): Set<GameSocket> {
        let loggedInKnowns: Set<GameSocket> = new Set();
        for (let getKnowns of socket.getKnownsList) {
            this.getLoggedInKnowns(socket, getKnowns(), loggedInKnowns, validator)
        }
        // make sure we don't send messages to ourselves (we might be in our own party / guild)
        loggedInKnowns.delete(socket); 
        return loggedInKnowns;
    }

    public getLoggedInKnowns(socket: GameSocket, currentKnowns: Iterable<string>, result: Set<GameSocket>, validator: (knownSocket: GameSocket) => boolean = _.constant(true)) {
        for (let knownName of currentKnowns) {
            let knownSocket = socket.map.get(knownName);
            if (knownSocket && validator(knownSocket)) {
                result.add(knownSocket);
            }
        }
        return result;
    }

    public getNotInRoomKnowns(socket: GameSocket): Set<GameSocket> {
        return this.getLoggedInKnownsFromList(socket, (knownSocket: GameSocket) => knownSocket.character.room !== socket.character.room);
    }

    public getKnownsNamespace(knowns: Set<GameSocket>): SocketIO.Namespace|undefined {
        for (let knownSocket of knowns) {
            var namespace: SocketIO.Namespace = (namespace || this.io).to(knownSocket.id);
        }
        return namespace;
    }

    public getKnownCharInfo(socket: GameSocket): KnownChar {
        let {_id, name, stats, room} = socket.character.toJSON();
        let fullStats = extendStatsWithMax(stats, socket);        
        return {_id, name, stats: fullStats, room};
    }
};