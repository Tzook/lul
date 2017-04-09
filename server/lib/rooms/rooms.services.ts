'use strict';
import MasterServices from '../master/master.services';
import { ROOM_SCHEMA } from "./rooms.model";

export default class RoomsServices extends MasterServices {
	private roomInfo: Map<string, ROOM_SCHEMA> = new Map();

	public generateRoom (scene): Promise<any> {
		console.log("Generating room from scene:", scene);
		let name = scene.name;
		let portals = {};
		(scene.Portals || []).forEach(portal => {
			portals[portal.TargetLevel] = {
				x: portal.PositionX,
				y: portal.PositionY
			};
		});
		let spawns = {};
		(scene.Spawners || []).forEach(spawner => {
			spawns[spawner.MonsterKey] = {
				cap: spawner.SpawnCap,
				interval: spawner.RespawnTime,
				x: spawner.PositionX,
				y: spawner.PositionY
			};
		});
		let room: ROOM_SCHEMA = {
			name,
			portals,
			spawns
		}
		let roomModel = new this.Model(room);
		
		return this.Model.findOneAndUpdate({name}, roomModel, {new: true, upsert: true});
	}

	public getRooms(): Promise<Map<string, ROOM_SCHEMA>> {
		return this.Model.find({}).lean()
			.then((docs: ROOM_SCHEMA[]) => {
				docs.forEach(doc => {
					this.roomInfo.set(doc.name, doc);
				});
				console.log("got rooms");
				return this.roomInfo;
			});
	}

	public getRoomInfo(room: string): ROOM_SCHEMA|undefined {
		return this.roomInfo.get(room);
	}
};