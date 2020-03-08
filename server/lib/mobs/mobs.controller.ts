import * as _ from "underscore";
import { getController } from "../main/bootstrap";
import MasterController from "../master/master.controller";
import mobsConfig from "../mobs/mobs.config";
import { getSockets } from "../socketio/socketio.router";
import { getMapOfMap } from "../utils/maps";
import MobsRouter from "./mobs.router";
import MobsServices, { getMobInfo, getSpawnIntervalTime } from "./mobs.services";

export default class MobsController extends MasterController {
    protected services: MobsServices;
    protected router: MobsRouter;
    private roomsMobs: Map<string, ROOM_MOBS> = new Map();
    // room => mobid => mob
    private mobById: Map<string, Map<string, MOB_INSTANCE>> = new Map();
    private mobsJustDied: Map<string, MOB_INSTANCE> = new Map();

    init(files, app) {
        this.router = files.router;
        super.init(files, app);
    }

    // Socket functions
    // =================
    public hasRoom(room: string) {
        return this.roomsMobs.has(room);
    }

    public getMobsMap(room: string, createIfMissing: boolean = false): Map<string, MOB_INSTANCE> {
        return getMapOfMap(this.mobById, room, createIfMissing);
    }

    public getMob(mobId: string, socket: GameSocket): MOB_INSTANCE | undefined {
        return this.getMobsMap(socket.character.room).get(mobId);
    }

    public getMobJustDied(mobId: string, socket: GameSocket): MOB_INSTANCE | undefined {
        return this.mobsJustDied.get(this.services.getMobRoomId(socket.character.room, mobId));
    }

    public startSpawningMobs(roomInfo: ROOM_MODEL, room: string) {
        let roomMobs: ROOM_MOBS = {
            spawns: [],
        };
        roomInfo.spawns.forEach(spawnInfo => {
            let spawn: SPAWN_INSTANCE = Object.assign({}, spawnInfo);
            let mobsInSpawn: Map<string, MOB_INSTANCE> = new Map();
            spawn.mobs = mobsInSpawn;
            roomMobs.spawns.push(spawn);

            if (spawn.delay) {
                setTimeout(() => this.spawnMobs(spawn, mobsInSpawn, room), spawn.delay);
            } else {
                this.spawnMobs(spawn, mobsInSpawn, room);
            }
        });
        this.roomsMobs.set(room, roomMobs);
    }

    protected spawnMobs(spawnInfo: SPAWN_INSTANCE, mobsInSpawn: Map<string, MOB_INSTANCE>, room: string) {
        if (this.canSpawn(spawnInfo)) {
            spawnInfo.times && spawnInfo.times--;
            const spawnCount = spawnInfo.bulk ? spawnInfo.cap - mobsInSpawn.size : 1;
            for (let i = 0; i < spawnCount; i++) {
                let mob = this.spawnMob(spawnInfo.mobId, spawnInfo.x, spawnInfo.y, room);
                mob.spawn = spawnInfo; // useful for when we delete the mob
                mobsInSpawn.set(mob.id, mob);
            }
            if (spawnInfo.cap - mobsInSpawn.size >= 1) {
                // we still have a mob to spawn - set an interval
                this.setRespawnTimer(spawnInfo, room);
            }
        }
    }

    public spawnMob(mobKey: string, x: number, y: number, room: string, bonusPerks: PERK_MAP = {}): MOB_INSTANCE {
        let mob: MOB_INSTANCE = Object.assign(getMobInfo(mobKey), {
            id: _.uniqueId("mob-"),
            x,
            y,
            dmgers: new Map(),
            threat: {
                top: "",
                map: new Map(),
            },
            dmged: 0,
            room,
            bonusPerks,
        });

        this.getMobsMap(room, true).set(mob.id, mob);
        this.notifyAboutMob(mob, () => this.io.to(room));
        return mob;
    }

    protected notifyAboutMob(mob: MOB_INSTANCE, getTo: () => SocketIO.Namespace | SocketIO.Socket) {
        getTo().emit(mobsConfig.CLIENT_GETS.MOB_SPAWN.name, {
            mob_id: mob.id,
            x: mob.x,
            y: mob.y,
            key: mob.mobId,
            hp: mob.hp,
        });
        if (mob.threat.top) {
            getTo().emit(mobsConfig.CLIENT_GETS.AGGRO.name, {
                id: getSockets().get(mob.threat.top).character._id,
                mob_id: mob.id,
            });
        }
    }

    public notifyAboutMobs(socket: GameSocket) {
        this.getMobsMap(socket.character.room).forEach(mob => {
            this.notifyAboutMob(mob, () => socket);
        });
    }

    public moveMob(mobId: string, x: number, y: number, socket: GameSocket) {
        let mob = this.getMob(mobId, socket);
        mob.x = x;
        mob.y = y;
    }

    public hurtMob(mob: MOB_INSTANCE, dmg: number, socket: GameSocket) {
        let actualDmg = this.services.getDamageToHurt(mob.hp, dmg);
        mob.hp -= actualDmg;

        let charDmgSoFar = mob.dmgers.get(socket.character.name) || 0;
        mob.dmgers.set(socket.character.name, charDmgSoFar + actualDmg);
        mob.dmged += actualDmg;

        this.addThreat(mob, actualDmg, socket);
    }

    public addThreat(mob: MOB_INSTANCE, threat: number, socket: GameSocket) {
        threat *= socket.getThreatModifier();
        threat += mob.threat.map.get(socket.character.name) || 0;
        mob.threat.map.set(socket.character.name, threat);

        socket.threats.add(mob);
        if (!mob.threat.top || (mob.threat.top !== socket.character.name && threat > mob.threat.map.get(mob.threat.top))) {
            mob.threat.top = socket.character.name;
            this.aggroChanged(mob, socket.character._id);
        }
    }

    private aggroChanged(mob: MOB_INSTANCE, id?: string) {
        this.router.getEmitter().emit(mobsConfig.SERVER_INNER.MOB_AGGRO_CHANGED.name, {
            mob,
            id,
        });
    }

    public removeThreat(mob: MOB_INSTANCE, socket: GameSocket) {
        let maxSocket: GameSocket;
        let maxThreat = 0;
        mob.threat.map.delete(socket.character.name);
        // pick a new top threat
        if (mob.threat.top === socket.character.name) {
            for (let [char, threat] of mob.threat.map) {
                let charSocket = socket.map.get(char);
                if (threat > maxThreat) {
                    [maxSocket, maxThreat] = [charSocket, threat];
                }
            }
            mob.threat.top = maxSocket ? maxSocket.character.name : undefined;
            this.aggroChanged(mob, maxSocket ? maxSocket.character._id : undefined);
        }
    }

    public despawnMob(mob: MOB_INSTANCE, socket: GameSocket) {
        this.io.to(socket.character.room).emit(mobsConfig.CLIENT_GETS.MOB_DIE.name, {
            mob_id: mob.id,
        });
        // remove mob references
        for (let [char] of mob.threat.map) {
            socket.map.get(char).threats.delete(mob);
        }
        const mobRoomId = this.services.getMobRoomId(socket.character.room, mob.id);
        let mobsMap = this.getMobsMap(mob.room);
        mobsMap.delete(mob.id);
        if (mobsMap.size === 0) {
            this.mobById.delete(mob.room);
        }
        // allow the mob to live in memory for a bit longer, so he can still hurt characters
        this.mobsJustDied.set(mobRoomId, mob);
        const mobDeathDebounce = (mob.deathSpell ? (mob.deathSpell.duration || 0) * 1000 : 0) + mobsConfig.MOB_DEATH_DEBOUNCE;
        setTimeout(() => this.mobsJustDied.delete(mobRoomId), mobDeathDebounce);

        if (mob.spawn) {
            mob.spawn.mobs.delete(mob.id);
            // if it's in bulk, only the last one should begin
            // else, if it's the first mob that we kill
            const mobsCountToRespawn = mob.spawn.bulk === "wave" ? 0 : mob.spawn.cap - 1;
            if (mob.spawn.mobs.size === mobsCountToRespawn) {
                this.setRespawnTimer(mob.spawn, socket.character.room);
            }
        }
    }

    protected setRespawnTimer(spawn: SPAWN_INSTANCE, room: string) {
        if (this.canSpawn(spawn)) {
            setTimeout(() => this.spawnMobs(spawn, spawn.mobs, room), getSpawnIntervalTime(spawn));
        }
    }

    protected canSpawn(spawn: SPAWN_INSTANCE): boolean {
        return spawn.times !== 0;
    }

    public clearRoom(socket: GameSocket) {
        const emitter = this.router.getEmitter();
        let map = this.roomsMobs.get(socket.character.room);
        if (map) {
            map.spawns.forEach(spawn => {
                spawn.times = 0; // make sure respawn doesn't occur
            });
            this.roomsMobs.delete(socket.character.room);
        }

        // despawn all mobs
        this.getMobsMap(socket.character.room).forEach(mob => {
            emitter.emit(mobsConfig.SERVER_INNER.MOB_DESPAWN.name, { mob }, socket);
        });
    }

    // HTTP functions
    // =================
    public generateMobs(req, res, next) {
        this.services
            .generateMobs(req.body.mobs)
            .then(d => {
                this.sendData(res, this.LOGS.GENERATE_MOB, d);
            })
            .catch(e => {
                this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, { e, fn: "generateMobs", file: "mobs.controller.js" });
            });
    }

    public warmMobsInfo(): void {
        this.services.getMobs().catch(e => {
            console.error("Had an error getting mobs from the db!");
            throw e;
        });
    }
}

export function getMobsController(): MobsController {
    return getController("mobs");
}

export function getMobDeadOrAlive(mobId: string, socket: GameSocket): MOB_INSTANCE | undefined {
    const controller = getMobsController();
    return getMob(mobId, socket) || controller.getMobJustDied(mobId, socket);
}

export function getMob(mobId, socket: GameSocket): MOB_INSTANCE | undefined {
    const controller = getMobsController();
    return controller.getMob(mobId, socket);
}
