'use strict';
import MasterServices from '../master/master.services';

export default class RoomsServices extends MasterServices {
	private roomsInfo: Map<string, ROOM_MODEL> = new Map();

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
		let spawns = [];
		(scene.Spawners || []).forEach(spawner => {
			spawns.push({
				mobId: spawner.MonsterKey,
				cap: spawner.SpawnCap,
				interval: spawner.RespawnTime,
				x: spawner.PositionX,
				y: spawner.PositionY
			});
		});
		let room: ROOM_MODEL = {
			name,
			portals,
			spawns
		}
		let roomModel = new this.Model(room);
		
		let updatedDocPromise = this.Model.findOneAndUpdate({name}, roomModel, {new: true, upsert: true});
		return <any>updatedDocPromise;
	}

	public getRooms(): Promise<Map<string, ROOM_MODEL>> {
		return this.Model.find({}).lean()
			.then((docs: ROOM_MODEL[]) => {
				docs.forEach(doc => {
					this.roomsInfo.set(doc.name, doc);
				});
				console.log("got rooms");
				return this.roomsInfo;
			});
	}

	public getRoomInfo(room: string): ROOM_MODEL|undefined {
		return this.roomsInfo.get(room);
	}
};