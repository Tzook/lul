
import MasterServices from '../master/master.services';
import NpcsRouter from "../npcs/npcs.router";

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
			spawns.push({
				mobId: spawner.MonsterKey,
				cap: spawner.SpawnCap,
				interval: spawner.RespawnTime,
				x: spawner.PositionX,
				y: spawner.PositionY
			});
		});
		let room: ROOM_MODEL = {
			name: scene.name,
			town: scene.nearestTownScene,
			portals,
			spawns
		}
        let roomModel = new this.Model(room);

        let npcsPromise = this.npcsRouter.updateNpcs(scene.name, scene.NPC);
		
		let updatedDocPromise = this.Model.findOneAndUpdate({name: room.name}, roomModel, {new: true, upsert: true});
		return Promise.all([updatedDocPromise, npcsPromise]);
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