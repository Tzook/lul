
import MasterServices from '../master/master.services';
import statsConfig from '../stats/stats.config';
import StatsRouter from '../stats/stats.router';
import RoomsRouter from '../rooms/rooms.router';
import roomsConfig from '../rooms/rooms.config';
import talentsConfig from '../talents/talents.config';

export default class ChatServices extends MasterServices {
    protected statsRouter: StatsRouter;
    protected roomsRouter: RoomsRouter;

	init(files, app) {
        this.statsRouter = files.routers.stats;
        this.roomsRouter = files.routers.rooms;
		super.init(files, app);
    }

    public useHax(socket: GameSocket, msg: string): boolean {
        let parts = msg.split(" ");

        let targetSocket = socket;
        if (parts[1]) {
            targetSocket = socket.map.get(parts[1]);
            if (!targetSocket) {
                this.statsRouter.sendError({msg}, socket, "Cannot hax - Target was not found", true, true);
                return false;
            }
        } 
        if (!targetSocket.connected || !targetSocket.alive) {
            this.statsRouter.sendError({msg}, socket, "Cannot hax - Target is disconnected or dead", true, true);
            return false;
        }
        
        switch (parts[0]) {
            case "/lvl":
                return this.statsRouter.getEmitter().emit(statsConfig.SERVER_INNER.GAIN_EXP.name, {
                    exp: this.statsRouter.getExp(targetSocket.character.stats.lvl)
                }, targetSocket);

            case "/lvlpa":
                let abilityLvl = targetSocket.character.talents._doc[targetSocket.character.stats.primaryAbility].lvl;
                return this.statsRouter.getEmitter().emit(talentsConfig.SERVER_INNER.GAIN_ABILITY_EXP.name, {
                    exp: this.statsRouter.getExp(abilityLvl)
                }, targetSocket);
            
            case "/tp":
                let room = parts[2];
                let roomInfo = this.roomsRouter.getRoomInfo(room);
                if (!roomInfo) {
                    this.statsRouter.sendError({msg}, socket, "Cannot hax - Room not found", true, true);
                    return false;
                }
                
                return this.roomsRouter.getEmitter().emit(roomsConfig.SERVER_INNER.MOVE_ROOM.name, {
                    room, 
                }, targetSocket);
        }

        return false;
    }
};
