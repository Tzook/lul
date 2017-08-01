import SocketioRouterBase from '../socketio/socketio.router.base';
import NpcsServices from "./npcs.services";

export default class NpcsRouter extends SocketioRouterBase {
    protected services: NpcsServices;

	init(files, app) {
		this.services = files.services;
		super.init(files, app);
	}

    public updateNpcs(room: string, npcs: {npcKey: string}[]): Promise<any> {
        return this.services.updateNpcs(room, npcs);
    }
};
