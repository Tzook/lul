
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

    protected itemHints: Map<string, ITEM_MODEL> = new Map();

	init(files, app) {
        this.statsRouter = files.routers.stats;
        this.roomsRouter = files.routers.rooms;
        this.itemsRouter = files.routers.items;
        this.talentsRouter = files.routers.talents;
        this.goldRouter = files.routers.gold;
		super.init(files, app);
    }

    public improveItemsKeysForHax(items: Map<string, ITEM_MODEL>) {
        for (let [itemKey, item] of items) {
            this.itemHints.set(getHintKey(itemKey), item);
        }
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
                return true;
            }
        } 
        if (!targetSocket.connected || !targetSocket.alive) {
            this.statsRouter.sendError({msg}, socket, "Cannot hax - Target is disconnected or dead", true, true);
            return true;
        }
        
        let emitter = this.statsRouter.getEmitter();
        switch (parts[0]) {
            case chatConfig.HAX.HELP.code: {
                let haxStrings = _.map(chatConfig.HAX, ({code, param}: {code: string, param?: string}) => {
                        return code + " {name?}" + (param ? ` ${param}` : "");
                    });
                targetSocket.emit(chatConfig.CLIENT_GETS.WHISPER.name, {
                    name: socket.character.name,
                    id: socket.character._id,
                    msg: "Available hax:\n" + haxStrings.join("\n"),
                });
            }
                
            case chatConfig.HAX.LVL.code: {
                const times = +parts[3] ? +parts[3] - targetSocket.character.stats.lvl : 1;
                (async () => {
                    for (let i = 0; i < times; i++) {
                        emitter.emit(statsConfig.SERVER_INNER.GAIN_EXP.name, {
                            exp: this.statsRouter.getExp(targetSocket.character.stats.lvl)
                        }, targetSocket);
                        if (parts[2]) {
                            const pool = targetSocket.character.charTalents._doc[talentsConfig.CHAR_TALENT].pool;
                            const perk = pickPerk(pool, parts[2]);
                            emitter.emit(talentsConfig.SERVER_GETS.CHOOSE_ABILITY_PERK.name, {
                                ability: talentsConfig.CHAR_TALENT,
                                perk,
                            }, targetSocket);
                        }
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                })();
            }
                
            case chatConfig.HAX.LVLPA.code: {
                const ability = targetSocket.character.stats.primaryAbility;
                const talent = targetSocket.character.talents._doc[ability];
                if (!talent) {
                    this.statsRouter.sendError({msg}, socket, "Cannot hax - Primary ability is not a real ability", true, true);
                    return true;
                }
                let times = +parts[3] ? +parts[3] - talent.lvl : 1;
                (async () => {
                    for (let i = 0; i < times; i++) {
                        let abilityLvl = talent.lvl;
                        emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY_EXP.name, {
                            exp: this.statsRouter.getExp(abilityLvl)
                        }, targetSocket);
                        if (parts[2]) {
                            const perk = pickPerk(talent.pool, parts[2]);
                            emitter.emit(talentsConfig.SERVER_GETS.CHOOSE_ABILITY_PERK.name, {
                                ability,
                                perk,
                            }, targetSocket);
                        }
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                })();
            }
                
            case chatConfig.HAX.GAINPA.code: {
                const ability = parts[2];
                const abilityInfo = this.talentsRouter.getAbilityInfo(ability);
                if (!abilityInfo) {
                    this.statsRouter.sendError({msg}, socket, "Cannot hax - ability not found", true, true);
                    return true;
                }
                emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY.name, {
                    ability
                }, targetSocket);
            }
                
            case chatConfig.HAX.TP.code: {
                let room = parts[2];
                let roomInfo = this.roomsRouter.getRoomInfo(room);
                if (!roomInfo) {
                    this.statsRouter.sendError({msg}, socket, "Cannot hax - Room not found", true, true);
                    return true;
                }
                
                emitter.emit(roomsConfig.SERVER_INNER.MOVE_ROOM.name, {
                    room, 
                }, targetSocket);
            }
                
            case chatConfig.HAX.GOLD.code: {
                const amount = +parts[2] > 0 ? +parts[2] : 10000;
                let goldItem = this.goldRouter.getGoldItem(amount);
                emitter.emit(itemsConfig.SERVER_INNER.ITEM_ADD.name, { 
                    item: goldItem
                }, targetSocket); 
            }
                
            case chatConfig.HAX.DROP.code: {
                let itemInfo = this.itemsRouter.getItemInfo(parts[2]);
                if (!itemInfo) {
                    itemInfo = this.itemHints.get(getHintKey(parts[2]));
                }
                if (!itemInfo) {
                    this.statsRouter.sendError({msg}, socket, "Cannot hax - Item not found", true, true);
                    return true;
                }
                let itemInstance = this.itemsRouter.getItemInstance(itemInfo.key);
                
                if (itemInfo.cap > 1) {
                    const stack = +parts[3] > 0 ? +parts[3] : 1;
                    itemInstance.stack = stack;
                }
                
                emitter.emit(dropsConfig.SERVER_INNER.ITEMS_DROP.name, {
                    owner: targetSocket.character.name
                }, targetSocket, [itemInstance]);
            }
        }

        return true;
    }
};

function pickPerk(pool: any, perksString: string): string {
    const perks = perksString.split("|");
    for (let perk of perks) {
        const perkRegex = new RegExp(perk, "i");
        for (let availablePerk of pool) {
            if (perkRegex.test(availablePerk)) {
                return availablePerk;
            }
        }
    }
    return _.sample(pool);
}

function getHintKey(key: string): string {
    return key.toLowerCase().replace(/_/g, "")
}