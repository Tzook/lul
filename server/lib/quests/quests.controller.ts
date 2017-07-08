
import MasterController from '../master/master.controller';
import QuestsServices from './quests.services';

export default class QuestsController extends MasterController {
    protected services: QuestsServices;
    
    // HTTP functions
	// =================
	public generateQuests(req, res, next) {
        this.services.generateQuests(req.body.quests)
			.then(d => {
				this.sendData(res, this.LOGS.GENERATE, d);
			})
			.catch(e => {
				this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "generateQuests", file: "quests.controller.js"});
			});
    }

	public warmQuestsInfo(): void {
		this.services.getQuests()
			.catch(e => {
				console.error("Had an error getting quests from the db!");
				throw e;
			});
    }
};