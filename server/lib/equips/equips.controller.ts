
import MasterController from '../master/master.controller';
import EquipsServices from './equips.services';

export default class EquipsController extends MasterController {
    protected services: EquipsServices;
    
    // HTTP functions
	// =================
	public beginEquips(req, res, next) {
        this.services.beginEquips(req.body.equips)
			.then(d => {
				this.sendData(res, this.LOGS.BEGIN_EQUIPS, d);
			})
			.catch(e => {
				this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, {e, fn: "beginEquips", file: "equips.controller.js"});
			});
    }
};