'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let config = require('../../../server/lib/party/party.config.json');
class PartyRouter extends socketio_router_base_1.default {
    [config.SERVER_GETS.CREATE_PARTY.name](data, socket) {
        if (this.controller.getCharParty(socket)) {
            return this.sendError(data, socket, "Cannot create - character already in party");
        }
        this.controller.createParty(socket);
    }
    [config.SERVER_GETS.INVITE_TO_PARTY.name](data, socket) {
        let party = this.controller.getCharParty(socket);
        if (!party) {
            return this.sendError(data, socket, "Cannot invite - must be in a party", true, true);
        }
        else if (!this.middleware.isLeader(socket.character.name, party)) {
            return this.sendError(data, socket, "Cannot invite - must be party leader", true, true);
        }
        else if (this.middleware.isPartyFull(party)) {
            return this.sendError(data, socket, "Cannot invite - party is full", true, true);
        }
        let inviteeSocket = socket.map.get(data.char_name);
        if (!inviteeSocket) {
            return this.sendError(data, socket, "Cannot invite - invitee is logged off", true, true);
        }
        else if (this.controller.getCharParty(inviteeSocket)) {
            return this.sendError(data, socket, "Cannot invite - invitee is already in a party", true, true);
        }
        this.controller.inviteToParty(inviteeSocket, party);
    }
    [config.SERVER_GETS.JOIN_PARTY.name](data, socket) {
        if (this.controller.getCharParty(socket)) {
            return this.sendError(data, socket, "Cannot join - already in party", true, true);
        }
        let party = this.controller.getParty(data.leader_name);
        if (!party) {
            return this.sendError(data, socket, "Cannot join - party is disbanded", true, true);
        }
        else if (!this.middleware.isInvited(party, socket)) {
            return this.sendError(data, socket, "Cannot join - not invited anymore", true, true);
        }
        else if (!this.middleware.isLeader(data.leader_name, party)) {
            return this.sendError(data, socket, "Cannot join - party leader has changed", true, true);
        }
        else if (this.middleware.isPartyFull(party)) {
            return this.sendError(data, socket, "Cannot join - party is full", true, true);
        }
        this.controller.joinParty(socket, party);
    }
    [config.SERVER_GETS.LEAVE_PARTY.name](data, socket) {
        let party = this.controller.getCharParty(socket);
        if (!party) {
            return this.sendError(data, socket, "Cannot leave - must be in a party", true, true);
        }
        this.controller.leaveParty(socket, party);
    }
    [config.SERVER_GETS.LEAD_PARTY.name](data, socket) {
        let party = this.controller.getCharParty(socket);
        if (!party) {
            return this.sendError(data, socket, "Cannot switch lead - must be in a party", true, true);
        }
        else if (!this.middleware.isLeader(socket.character.name, party)) {
            return this.sendError(data, socket, "Cannot switch lead - must be party leader", true, true);
        }
        else if (!party.members.has(data.char_name)) {
            return this.sendError(data, socket, "Cannot switch lead - character not in party", true, true);
        }
        this.controller.makeLeader(socket, data.char_name, party);
    }
    [config.SERVER_GETS.KICK_FROM_PARTY.name](data, socket) {
        let party = this.controller.getCharParty(socket);
        if (!party) {
            return this.sendError(data, socket, "Cannot kick - must be in a party", true, true);
        }
        else if (!this.middleware.isLeader(socket.character.name, party)) {
            return this.sendError(data, socket, "Cannot kick - must be party leader", true, true);
        }
        else if (!party.members.has(data.char_name)) {
            return this.sendError(data, socket, "Cannot kick - character not in party", true, true);
        }
        this.controller.kickFromParty(socket, data.char_name, party);
    }
    onConnected(socket) {
        let party = this.controller.getCharParty(socket);
        if (party) {
            this.controller.tellPartyMembers(socket, party);
        }
    }
}
exports.default = PartyRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydHkucm91dGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9wYXJ0eS9wYXJ0eS5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUdsRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUVwRSxpQkFBaUMsU0FBUSw4QkFBa0I7SUFJdkQsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDM0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsNENBQTRDLENBQUMsQ0FBQztRQUN0RixDQUFDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVELENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQWtCO1FBQzNELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsb0NBQW9DLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzFGLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxzQ0FBc0MsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUYsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSwrQkFBK0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckYsQ0FBQztRQUVELElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNuRCxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDakIsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSx1Q0FBdUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDN0YsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDckQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSwrQ0FBK0MsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDckcsQ0FBQztRQUVELElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDdEQsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsZ0NBQWdDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RGLENBQUM7UUFFRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDdkQsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxrQ0FBa0MsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDeEYsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbkQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxtQ0FBbUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDekYsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVELE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsd0NBQXdDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzlGLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVDLE1BQU0s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