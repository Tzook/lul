
import Response from './master.response';

export default class MasterController extends Response {
    protected io: SocketIO.Namespace;

    init(files, app) {
        super.init(files, app);
        this.io = app.socketio;
    }
};