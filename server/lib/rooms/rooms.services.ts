
import MasterServices from '../master/master.services';
import NpcsRouter from "../npcs/npcs.router";
import * as _ from 'underscore';
import { extendRoomSchemaWithTalents } from '../talents/talents.services';
import { getServices, getEmitter } from '../main/bootstrap';
import roomsConfig from './rooms.config';
import { extendRoomWithCombat } from '../combat/combat.services';

const ROOM_NAME_INSTANCE_SEPARATOR = "~~";

export default class RoomsServices extends MasterServices {
    private roomsInfo: Map<string, ROOM_MODEL> = new Map();
    protected npcsRouter: NpcsRouter;

	init(files, app) {
        super.init(files, app);
		this.npcsRouter = files.routers.npcs;
    }
    
    // HTTP functions
	// =================
	public generateRoom (scene): Promise<any> {
		console.log("Generating room from scene:", scene);
		let portals = {};
		(scene.Portals || []).forEach(portal => {
			let portalModel: PORTAL_MODEL = {
				x: portal.PositionX,
				y: portal.PositionY,
				targetRoom: portal.TargetLevel,
				targetPortal: portal.targetPortal,
			};
			portals[portal.key] = portalModel;
		});
		let spawns: SPAWN_MODEL[] = [];
		(scene.Spawners || []).forEach(spawner => {
			let spawnerModel: SPAWN_MODEL = {
				mobId: spawner.MonsterKey,
				cap: spawner.SpawnCap,
				interval: spawner.RespawnTime,
				x: spawner.PositionX,
				y: spawner.PositionY
			};
			if (spawner.Bulk && spawner.Bulk !== "None") {
				spawnerModel.bulk = spawner.Bulk.toLowerCase();
			}
			if (spawner.SpawnTimes > 0) {
				spawnerModel.times = +spawner.SpawnTimes;
			}
			spawns.push(spawnerModel);
		});
		let room: ROOM_MODEL = {
			name: scene.name,
			town: scene.nearestTownScene,
			portals,
			spawns
        };
        extendRoomSchemaWithTalents(scene, room);
        extendRoomWithCombat(scene, room);
        let roomModel = new this.Model(room);

		const allRooms = (scene.all || "").split(",");
        const npcsPromise = this.npcsRouter.updateNpcs(scene.name, scene.NPC, allRooms);
		const removeUnneededScenesPromise = this.Model.remove({name: {$nin: allRooms}});
		const updatedDocPromise = this.Model.findOneAndUpdate({name: room.name}, roomModel, {new: true, upsert: true});
		return Promise.all([updatedDocPromise, removeUnneededScenesPromise, npcsPromise]);
	}

	public getRooms(): Promise<Map<string, ROOM_MODEL>> {
		return this.Model.find({}).lean()
			.then((docs: ROOM_MODEL[]) => {
				docs.forEach(doc => {
					this.roomsInfo.set(doc.name, doc);
				});
				console.log("got rooms");
				getEmitter().emit(roomsConfig.GLOBAL_ROOMS_READY.name, this.roomsInfo);
				return this.roomsInfo;
			});
	}

	public getRoomInfo(room: string): ROOM_MODEL|undefined {
		return this.roomsInfo.get(room) || this.roomsInfo.get(getRoomInstanceName(room));
	}
};  

export function getRoomInstance(room: string) {
	return _.uniqueId(room + ROOM_NAME_INSTANCE_SEPARATOR);
};

export function getRoomName(socket: GameSocket): string {
	return getRoomInstanceName(socket.character.room);
};

function getRoomInstanceName(room: string): string {
	return room.split(ROOM_NAME_INSTANCE_SEPARATOR)[0];
}

export function isInInstance(socket: GameSocket) {
	return socket.character.room.includes(ROOM_NAME_INSTANCE_SEPARATOR);
};

export function getRoomInfo(room: string): ROOM_MODEL|undefined {
    const roomsServices: RoomsServices = getServices("rooms");
    return roomsServices.getRoomInfo(room);
}