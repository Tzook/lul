'use strict';
import MasterMiddleware from '../master/master.middleware';
import RoomsServices from "./rooms.services";

export default class RoomsMiddleware extends MasterMiddleware {
	protected services: RoomsServices;

	public canEnterRoom(wantedRoom: string, currentRoom: string): boolean {
		let roomInfo = this.services.getRoomInfo(currentRoom);
		return !!(roomInfo && roomInfo.portals[wantedRoom]);
	}
};