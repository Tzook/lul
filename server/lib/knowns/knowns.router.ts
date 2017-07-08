
import SocketioRouterBase from '../socketio/socketio.router.base';
import KnownsServices from './knowns.services';
import RoomsRouter from '../rooms/rooms.router';
import config from '../knowns/knowns.config';
import statsConfig from '../stats/stats.config';

export default class KnownsRouter extends SocketioRouterBase {
    protected services: KnownsServices;
    protected roomsRouter: RoomsRouter;
	
	init(files, app) {
		this.services = files.services;
        this.roomsRouter = files.routers.rooms;
		super.init(files, app);
	}

    [config.SERVER_INNER.GAIN_LVL.name] (data, socket: GameSocket) {
        let namespace = this.services.getKnownsNamespace(this.services.getNotInRoomKnowns(socket));
        if (namespace) {
            namespace.emit(statsConfig.CLIENT_GETS.LEVEL_UP.name, {
                id: socket.character._id
            });
        }
    }

	[config.SERVER_INNER.MOVE_ROOM.name](data: {room: string}, socket: GameSocket) {
        let namespace = this.services.getKnownsNamespace(this.services.getLoggedInKnowns(socket));
        if (namespace) {
            namespace.emit(config.CLIENT_GETS.KNOWN_MOVE_ROOM.name, {
                name: socket.character.name,
                room: data.room
            });
        }
	}

    [config.SERVER_GETS.DISCONNECT.name](data, socket: GameSocket) {
        let namespace = this.services.getKnownsNamespace(this.services.getLoggedInKnowns(socket));
        if (namespace) {
            namespace.emit(config.CLIENT_GETS.KNOWN_LOGOUT.name, {
                name: socket.character.name
            });
        }
	}

    public onConnected(socket: GameSocket) {
        // wait for all places to assign it, so do it on the next tick
        process.nextTick(() => {
            let knowns = this.services.getLoggedInKnowns(socket);
            for (let knownSocket of knowns) {
                socket.emit(config.CLIENT_GETS.KNOWN_INFO.name, {
                    character: this.roomsRouter.getPublicCharInfo(knownSocket.character)
                });
            }
            let namespace = this.services.getKnownsNamespace(knowns);
            if (namespace) {
                namespace.emit(config.CLIENT_GETS.KNOWN_LOGIN.name, {
                    character: this.roomsRouter.getPublicCharInfo(socket.character)
                });
            }
        });
    }
};
