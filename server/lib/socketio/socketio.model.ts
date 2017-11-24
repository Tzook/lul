
import MasterModel from '../master/master.model';
import SocketioServices from './socketio.services';

export const PRIORITY_CONFIG = 5;

export default class SocketioModel extends MasterModel {
    protected services: SocketioServices;

    init(files, app) {
        this.services = files.services;
        this.schema = {};
        this.listenForSchemaAddition("Config");
    }

    get priority() {
        return PRIORITY_CONFIG;
    }

    createModel() {
        this.setModel("Config");
        this.removeListen("Config");

        setTimeout(() => this.services.warmConfig()); // timeout so the Model can be set
        return Promise.resolve();
    }
};