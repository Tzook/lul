
import MasterServices from '../master/master.services';
import statsConfig from '../stats/stats.config';
import StatsRouter from '../stats/stats.router';
import RoomsRouter from '../rooms/rooms.router';
import roomsConfig from '../rooms/rooms.config';
import talentsConfig from '../talents/talents.config';
import itemsConfig from '../items/items.config';
import GoldRouter from '../gold/gold.router';
import chatConfig from './chat.config';
import * as _ from 'underscore';
import ItemsRouter from '../items/items.router';
import dropsConfig from '../drops/drops.config';
import TalentsRouter from '../talents/talents.router';

export default class ChatServices extends MasterServices {
    protected statsRouter: StatsRouter;
    protected roomsRouter: RoomsRouter;
    protected itemsRouter: ItemsRouter;
    protected talentsRouter: TalentsRouter;
    protected goldRouter: GoldRouter;

	init(files, app) {
        this.statsRouter = files.routers.stats;
        this.roomsRouter = files.routers.rooms;
        this.itemsRouter = files.routers.items;
        this.talentsRouter = files.routers.talents;
        this.goldRouter = files.routers.gold;
		super.init(files, app);
    }

    public useHax(socket: GameSocket, msg: string): boolean {
        if (msg[0] !== "/") {
            return false;
        }
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
        
        let emitter = this.statsRouter.getEmitter();
        switch (parts[0]) {
            case chatConfig.HAX.HELP.code: {
                let haxStrings = _.map(chatConfig.HAX, ({code, param}: {code: string, param?: string}) => {
                        return code + " {name?}" + (param ? ` ${param}` : "");
                    });
                return targetSocket.emit(chatConfig.CLIENT_GETS.WHISPER.name, {
                    name: socket.character.name,
                    id: socket.character._id,
                    msg: "Available hax:\n" + haxStrings.join("\n"),
                });
            }
                
            case chatConfig.HAX.LVL.code: {
                return emitter.emit(statsConfig.SERVER_INNER.GAIN_EXP.name, {
                    exp: this.statsRouter.getExp(targetSocket.character.stats.lvl)
                }, targetSocket);
            }
                
            case chatConfig.HAX.LVLPA.code: {
                const ability = targetSocket.character.stats.primaryAbility;
                const talent = targetSocket.character.talents._doc[ability];
                let abilityLvl = talent.lvl;
                emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY_EXP.name, {
                    exp: this.statsRouter.getExp(abilityLvl)
                }, targetSocket);
                if (parts[2]) {
                    emitter.emit(talentsConfig.SERVER_GETS.CHOOSE_ABILITY_PERK.name, {
                        ability,
                        perk: _.sample(talent.pool)
                    }, targetSocket);
                }
                return true;
            }
                
            case chatConfig.HAX.GAINPA.code: {
                const ability = parts[2];
                const abilityInfo = this.talentsRouter.getAbilityInfo(ability);
                if (!abilityInfo) {
                    this.statsRouter.sendError({msg}, socket, "Cannot hax - ability not found", true, true);
                    return false;
                }
                return emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY.name, {
                    ability
                }, targetSocket);
            }
                
            case chatConfig.HAX.TP.code: {
                let room = parts[2];
                let roomInfo = this.roomsRouter.getRoomInfo(room);
                if (!roomInfo) {
                    this.statsRouter.sendError({msg}, socket, "Cannot hax - Room not found", true, true);
                    return false;
                }
                
                return emitter.emit(roomsConfig.SERVER_INNER.MOVE_ROOM.name, {
                    room, 
                }, targetSocket);
            }
                
            case chatConfig.HAX.GOLD.code: {
                const amount = +parts[2] > 0 ? +parts[2] : 10000;
                let goldItem = this.goldRouter.getGoldItem(amount);
                return emitter.emit(itemsConfig.SERVER_INNER.ITEM_ADD.name, { 
                    item: goldItem
                }, targetSocket); 
            }
                
            case chatConfig.HAX.DROP.code: {
                let itemInfo = this.itemsRouter.getItemInfo(parts[2]);
                if (!itemInfo) {
                    this.statsRouter.sendError({msg}, socket, "Cannot hax - Item not found", true, true);
                    return false;
                }
                let itemInstance = this.itemsRouter.getItemInstance(parts[2]);
                
                if (itemInfo.cap > 1) {
                    const stack = +parts[3] > 0 ? +parts[3] : 1;
                    itemInstance.stack = stack;
                }
                
                return emitter.emit(dropsConfig.SERVER_INNER.ITEMS_DROP.name, {owner: targetSocket.character.name}, targetSocket, [itemInstance]);
            }
        }

        return false;
    }
};
