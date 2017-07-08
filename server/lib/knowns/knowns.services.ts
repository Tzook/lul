
import MasterServices from '../master/master.services';
import * as _ from "underscore";

export default class KnownsServices extends MasterServices {
    protected io: SocketIO.Namespace;

	init(files, app) {
		this.io = app.io;
		super.init(files, app);
	}

    public getLoggedInKnowns(socket: GameSocket, validator: (knownSocket: GameSocket) => boolean = _.constant(true)): Set<GameSocket> {
        let knowns: Set<GameSocket> = new Set();
        for (let getKnowns of socket.getKnownsList) {
            let currentKnowns = getKnowns();
            for (let knownName of currentKnowns) {
                let knownSocket = socket.map.get(knownName);
                if (knownSocket && validator(knownSocket)) {
                    knowns.add(knownSocket);
                }
            }
        }
        // make sure we don't send messages to ourselves (we might be in our own party / guild)
        knowns.delete(socket); 
        return knowns;
    }

    public getNotInRoomKnowns(socket: GameSocket): Set<GameSocket> {
        return this.getLoggedInKnowns(socket, (knownSocket: GameSocket) => knownSocket.character.room !== socket.character.room);
    }

    public getKnownsNamespace(knowns: Set<GameSocket>): SocketIO.Namespace|undefined {
        for (let knownSocket of knowns) {
            var namespace: SocketIO.Namespace = (namespace || this.io).to(knownSocket.id);
        }
        return namespace;
    }
};