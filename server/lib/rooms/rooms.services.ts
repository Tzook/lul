'use strict';
import MasterServices from '../master/master.services';

export default class RoomsServices extends MasterServices {
	public generateRoom (scene): Promise<any> {
		console.log("Generating room from scene:", scene);
		let name = scene.name;
		let portals = (scene.Portals || []).map(portal => ({
			target: portal.TargetLevel,
			x: portal.PositionX,
			y: portal.PositionY
		}));
		let spawns = (scene.Spawners || []).map(spawner => ({
			mob: spawner.MonsterKey,
			cap: spawner.SpawnCap,
			interval: spawner.RespawnTime,
			x: spawner.PositionX,
			y: spawner.PositionY
		}));
		let room = new this.Model({
			name,
			portals,
			spawns,
		});
		
		return this.Model.findOneAndUpdate({name}, room, {new: true, upsert: true});
	}
};