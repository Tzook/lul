import MasterController from "../master/master.controller";
import dungeonConfig from "./dungeon.config";
import masterConfig from "../master/master.config";
import { generateDungeons } from "./dungeon.model";

export default class DungeonController extends MasterController {
	// HTTP functions
	// =================
	public generateDungeons(req, res, next) {
        generateDungeons(req.body.dungeons)
			.then(d => {
				this.sendData(res, dungeonConfig.LOGS.GENERATE_DUNGEONS, d);
			})
			.catch(e => {
				this.sendError(res, masterConfig.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "generateDungeons", file: "dungeon.controller.js"});
			});
    }
};