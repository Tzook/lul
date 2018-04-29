
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
import { spawnMob, getMobInfo } from '../mobs/mobs.services';

export default class ChatServices extends MasterServices {
    protected statsRouter: StatsRouter;
    protected roomsRouter: RoomsRouter;
    protected itemsRouter: ItemsRouter;
    protected talentsRouter: TalentsRouter;
    protected goldRouter: GoldRouter;

    protected itemHints: Map<string, ITEM_MODEL> = new Map();
    protected roomHints: Map<string, ROOM_MODEL> = new Map();
    protected mobHints: Map<string, MOB_MODEL> = new Map();

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

    public improveRoomsKeysForHax(rooms: Map<string, ROOM_MODEL>) {
        for (let [roomKey, room] of rooms) {
            this.roomHints.set(getHintKey(roomKey), room);
        }
    }

    public improveMobsKeysForHax(mobs: Map<string, MOB_MODEL>) {
        for (let [mobKey, mob] of mobs) {
            this.mobHints.set(getHintKey(mobKey), mob);
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
                haxStrings.unshift("Available hax:");
                targetSocket.emit(chatConfig.CLIENT_GETS.WHISPER.name, {
                    name: socket.character.name,
                    id: socket.character._id,
                    msg: haxStrings.join("\n"),
                });
                break;
            }
                
            case chatConfig.HAX.LVL.code: {
                const times = +parts[3] ? +parts[3] : 1;
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
                break;
            }
                
            case chatConfig.HAX.LVLPA.code: {
                const ability = parts[4] || targetSocket.character.stats.primaryAbility;
                let talent = targetSocket.character.talents._doc[ability];
                if (!talent) {
                    talent = targetSocket.character.charTalents._doc[ability];
                }
                if (!talent) {
                    this.statsRouter.sendError({msg}, socket, "Cannot hax - Primary ability is not a real ability", true, true);
                    return true;
                }
                let times = +parts[3] ? +parts[3] : 1;
                (async () => {
                    for (let i = 0; i < times; i++) {
                        let abilityLvl = talent.lvl;
                        emitter.emit(talentsConfig.SERVER_INNER.GAIN_ABILITY_EXP.name, {
                            exp: this.statsRouter.getExp(abilityLvl),
                            talent,
                            ability
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
                break;
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
                break;
            }
                
            case chatConfig.HAX.TP.code: {
                let room = parts[2];
                let roomInfo = this.roomsRouter.getRoomInfo(room);
                if (!roomInfo) {
                    roomInfo = this.roomHints.get(getHintKey(parts[2]));                    
                }
                if (!roomInfo) {
                    return this.showMatchingResults(parts[2], this.roomHints, (room: ROOM_MODEL) => room.name, socket);
                }
                
                emitter.emit(roomsConfig.SERVER_INNER.MOVE_ROOM.name, {
                    room: roomInfo.name, 
                }, targetSocket);
                break;
            }
                
            case chatConfig.HAX.GOLD.code: {
                const amount = +parts[2] > 0 ? +parts[2] : 10000;
                let goldItem = this.goldRouter.getGoldItem(amount);
                emitter.emit(itemsConfig.SERVER_INNER.ITEM_ADD.name, { 
                    item: goldItem
                }, targetSocket); 
                break;
            }
                
            case chatConfig.HAX.DROP.code: {
                let itemInfo = this.itemsRouter.getItemInfo(parts[2]);
                if (!itemInfo) {
                    itemInfo = this.itemHints.get(getHintKey(parts[2]));
                }
                if (!itemInfo) {
                    return this.showMatchingResults(parts[2], this.itemHints, (item: ITEM_MODEL) => item.key, socket);
                }
                let itemInstance = this.itemsRouter.getItemInstance(itemInfo.key);
                
                if (itemInfo.cap > 1) {
                    const stack = +parts[3] > 0 ? +parts[3] : 1;
                    itemInstance.stack = stack;
                }
                
                emitter.emit(dropsConfig.SERVER_INNER.ITEMS_DROP.name, {
                    owner: targetSocket.character.name
                }, targetSocket, [itemInstance]);
                break;
            }
                
            case chatConfig.HAX.SPAWN.code: {
                let mobInfo = getMobInfo(parts[2]);
                if (!mobInfo) {
                    mobInfo = this.mobHints.get(getHintKey(parts[2]));
                }
                if (!mobInfo) {
                    return this.showMatchingResults(parts[2], this.mobHints, (mob: MOB_MODEL) => mob.mobId, socket);
                }
                
                spawnMob(mobInfo.mobId, targetSocket.character.position.x, targetSocket.character.position.y, targetSocket.character.room);
                break;
            }
        }

        return true;
    }

    protected showMatchingResults(requestedKey: string, map: Map<string, any>, displayKeyGetter: (element: any) => string, socket: GameSocket): true {
        requestedKey = getHintKey(requestedKey);
        let startingWithResults = [];
        let containsResults = [];
        map.forEach((element, actualKey) => {
            if (actualKey.startsWith(requestedKey)) {
                startingWithResults.push(displayKeyGetter(element));
            } else if (actualKey.includes(requestedKey)) {
                containsResults.push(displayKeyGetter(element));
            }
        });
        startingWithResults.sort();
        containsResults.sort();
        const combined = startingWithResults.concat(containsResults);
        const result = combined.slice(0, 10);
        const notShownCount = combined.length - result.length;
        
        if (result.length > 0) {
            socket.emit(chatConfig.CLIENT_GETS.WHISPER.name, {
                name: socket.character.name,
                id: socket.character._id,
                msg: "Did you mean:\n" + result.join(", ") + (notShownCount > 0 ? `... (${notShownCount} more)` : ""),
            });
        } else {
            this.statsRouter.sendError({}, socket, "Cannot hax - key not found", true, true);    
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
    return (key || "").toLowerCase().replace(/_/g, "")
}