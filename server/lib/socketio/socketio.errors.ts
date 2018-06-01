import { getSocketioRouter } from "./socketio.router";
import socketioConfig from "./socketio.config";

export function sendError(data: any, socket: GameSocket, error: string, emit = true, display = false) {
	const socketioRouter = getSocketioRouter();
	return socketioRouter.sendError(data, socket, error, emit, display);
}

export function sendFatal(to: NodeJS.EventEmitter|GameSocket, error: Error, event?: string) {
	const socketioRouter = getSocketioRouter();
	return socketioRouter.fatal(to, error, event);
}

export function notifyUserAboutError(to: NodeJS.EventEmitter, error: string, display: boolean) {
	to.emit(socketioConfig.CLIENT_GETS.EVENT_ERROR.name, {
		error,
		display,
	});
}
