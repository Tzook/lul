
import MasterServices from '../master/master.services';
import { getEmitter } from '../main/bootstrap';
import socketioConfig from './socketio.config';

export default class SocketioServices extends MasterServices {
	private config: Config;

	public getConfig(): Config {
		return this.config;
	}

    public warmConfig(): Promise<Config> {
		return this.Model.find({})
			.then((docs: Config[]) => {
				console.log("got config");
				this.config = docs[0];
				getEmitter().emit(socketioConfig.GLOBAL_CONFIG_READY.name);
				return this.config;
			});
	}
};