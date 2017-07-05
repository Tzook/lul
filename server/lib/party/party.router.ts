'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import PartyController from './party.controller';
import PartyMiddleware from './party.middleware';
import config from "./party.config";

export default class PartyRouter extends SocketioRouterBase {
    protected controller: PartyController;
    protected middleware: PartyMiddleware;
    
    [config.SERVER_GETS.CREATE_PARTY.name](data, socket: GameSocket) {
        if (this.controller.getCharParty(socket)) {
            return this.sendError(data, socket, "Cannot create - character already in party");
        }
        this.controller.createParty(socket);
	}

	[config.SERVER_GETS.INVITE_TO_PARTY.name](data, socket: GameSocket) {
        let party = this.controller.getCharParty(socket);
        if (!party) {
            return this.sendError(data, socket, "Cannot invite - must be in a party", true, true);
        } else if (!this.middleware.isLeader(socket.character.name, party)) {
            return this.sendError(data, socket, "Cannot invite - must be party leader", true, true);
        } else if (this.middleware.isPartyFull(party)) {
            return this.sendError(data, socket, "Cannot invite - party is full", true, true);
        }

        let inviteeSocket = socket.map.get(data.char_name);
        if (!inviteeSocket) {
            return this.sendError(data, socket, "Cannot invite - invitee is logged off", true, true);
        } else if (this.controller.getCharParty(inviteeSocket)) {
            return this.sendError(data, socket, "Cannot invite - invitee is already in a party", true, true);
        }

        this.controller.inviteToParty(inviteeSocket, party);
	}

	[config.SERVER_GETS.JOIN_PARTY.name](data, socket: GameSocket) {
        if (this.controller.getCharParty(socket)) {
            return this.sendError(data, socket, "Cannot join - already in party", true, true);
        }

        let party = this.controller.getParty(data.leader_name);
        if (!party) {
            return this.sendError(data, socket, "Cannot join - party is disbanded", true, true);
        } else if (!this.middleware.isInvited(party, socket)) {
            return this.sendError(data, socket, "Cannot join - not invited anymore", true, true);
        } else if (!this.middleware.isLeader(data.leader_name, party)) {
            return this.sendError(data, socket, "Cannot join - party leader has changed", true, true);
        } else if (this.middleware.isPartyFull(party)) {
            return this.sendError(data, socket, "Cannot join - party is full", true, true);
        }

        this.controller.joinParty(socket, party);
	}

	[config.SERVER_GETS.LEAVE_PARTY.name](data, socket: GameSocket) {
        let party = this.controller.getCharParty(socket);
        if (!party) {
            return this.sendError(data, socket, "Cannot leave - must be in a party", true, true);
        }
        this.controller.leaveParty(socket, party);
	}

	[config.SERVER_GETS.LEAD_PARTY.name](data, socket: GameSocket) {
        let party = this.controller.getCharParty(socket);
        if (!party) {
            return this.sendError(data, socket, "Cannot switch lead - must be in a party", true, true);
        } else if (!this.middleware.isLeader(socket.character.name, party)) {
            return this.sendError(data, socket, "Cannot switch lead - must be party leader", true, true);
        } else if (!this.middleware.isMember(data.char_name, party)) {
            return this.sendError(data, socket, "Cannot switch lead - character not in party", true, true);
        }
        this.controller.makeLeader(data.char_name, party);
	}

	[config.SERVER_GETS.KICK_FROM_PARTY.name](data, socket: GameSocket) {
        let party = this.controller.getCharParty(socket);
        if (!party) {
            return this.sendError(data, socket, "Cannot kick - must be in a party", true, true);
        } else if (!this.middleware.isLeader(socket.character.name, party)) {
            return this.sendError(data, socket, "Cannot kick - must be party leader", true, true);
        } else if (!this.middleware.isMember(data.char_name, party)) {
            return this.sendError(data, socket, "Cannot kick - character not in party", true, true);
        }
        this.controller.kickFromParty(socket, data.char_name, party);
	}

    public onConnected(socket: GameSocket) {
        {
            let party = this.controller.getCharParty(socket);
            if (party) {
                this.controller.tellPartyMembers(socket, party);
            }
        }
        socket.getKnownsList = socket.getKnownsList || [];
        socket.getKnownsList.push(() => {
            let party = this.controller.getCharParty(socket);
            return party && party.members || [];
        });
    }

    public getCharParty(socket: GameSocket): PARTY_MODEL|undefined {
        return this.controller.getCharParty(socket);
    }

    public getPartyMembersInMap(socket: GameSocket): GameSocket[] {
        return this.controller.getPartyMembersInMap(socket);
    }

    public arePartyMembers(name1: string, name2: string): boolean {
        return this.controller.arePartyMembers(name1, name2);
    }
};
