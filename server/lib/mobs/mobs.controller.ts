'use strict';
import MasterController from '../master/master.controller';
import MobsServices from "./mobs.services";
let config = require('../../../server/lib/mobs/mobs.config.json');

export default class MobsController extends MasterController {
	protected services: MobsServices;

	public generateMob(req, res, next) {
        this.services.generateMob(req.body.mob)
			.then(d => {
				this.sendData(res, this.LOGS.GENERATE_MOB, d);
			})
			.catch(e => {
				this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "generateMob", file: "mobs.controller.js"});
			});
    }

	public warmMobsInfo(): void {
		let getMobs = () => {
			this.services.getMobs()
				.catch(e => {
					console.error("Had an error getting mobs from the db!");
					throw e;
				});
		};

		getMobs();

		setInterval(getMobs, config.MOBS_REFRESH_INTERVAL);
	}
};