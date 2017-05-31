'use strict';
import MasterServices from '../master/master.services';

export default class SocketioServices extends MasterServices {
	private config: Config;

	public getConfig(): Config {
		return this.config;
	}

    public warmConfig(): Promise<Config> {
		return this.Model.find({})
			.then((docs: Config[]) => {
				console.log("got config");
				return this.config = docs[0];
			});
	}
};