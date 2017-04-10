'use strict';
import MasterController from '../master/master.controller';
import MobsServices from "./mobs.services";
let config = require('../../../server/lib/mobs/mobs.config.json');

export default class MobsController extends MasterController {
	protected services: MobsServices;

	public generateMobs(req, res, next) {
        this.services.generateMobs(req.body.mobs)
			.then(d => {
				this.sendData(res, this.LOGS.GENERATE_MOB, d);
			})
			.catch(e => {
				this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "generateMobs", file: "mobs.controller.js"});
			});
    }

	public warmMobsInfo(): void {
		let getMobs = () => {
			return this.services.getMobs()
				.catch(e => {
					console.error("Had an error getting mobs from the db!");
					throw e;
				});
		};

		getMobs()
			.then(d => {
				
			});

		setInterval(getMobs, config.MOBS_REFRESH_INTERVAL);
	}
};