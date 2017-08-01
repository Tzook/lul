import MasterController from '../master/master.controller';
import NpcsServices from "./npcs.services";

export default class NpcsController extends MasterController {
    protected services: NpcsServices;

	public warmNpcsInfo(): void {
		this.services.getNpcs()
			.catch(e => {
				console.error("Had an error getting npcs from the db!");
				throw e;
			});
	}
};