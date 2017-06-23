'use strict';
import MasterController from '../master/master.controller';
import PartyServices from './party.services';
import PartyMiddleware from './party.middleware';
let config = require('../../../server/lib/party/party.config.json');

export default class PartyController extends MasterController {
    protected services: PartyServices;
    protected middleware: PartyMiddleware;
    private charToParty: Map<string, PARTY_MODEL> = new Map();

	init(files, app) {
		this.middleware = files.middleware;
		super.init(files, app);
	}

    public getCharParty(socket: GameSocket): PARTY_MODEL|undefined {
        return this.getParty(socket.character.name);
    }

    public getParty(name: string): PARTY_MODEL|undefined {
        return this.charToParty.get(name);;
    }

    public createParty(socket: GameSocket) {
        socket.emit(config.CLIENT_GETS.CREATE_PARTY.name, {});
        let party: PARTY_MODEL = {
            name: this.services.getPartyName(),
            leader: socket.character.name,
            members: new Set(),
            invitees: new Map(),
        };
        this.charToParty.set(socket.character.name, party);
        socket.join(party.name);
    }

    public inviteToParty(inviteeSocket: GameSocket, party: PARTY_MODEL) {
        inviteeSocket.emit(config.CLIENT_GETS.INVITE_TO_PARTY.name, {});
        party.invitees.set(inviteeSocket.character.name, setTimeout(() => {
            // remove the invitation after a certain amount of time
            party.invitees.delete(inviteeSocket.character.name);
        }, config.INVITE_EXPIRE_TIME));
    }

    public joinParty(socket: GameSocket, party: PARTY_MODEL) {
        socket.join(party.name);

        this.io.to(party.name).emit(config.CLIENT_GETS.JOIN_PARTY.name, {
            char_name: socket.character.name
        });
        this.tellPartyMembers(socket, party);

        this.charToParty.set(socket.character.name, party);
        party.members.add(socket.character.name);
        clearTimeout(party.invitees.get(socket.character.name));
        party.invitees.delete(socket.character.name);
    }

    public leaveParty(socket: GameSocket, party: PARTY_MODEL) {
        this.io.to(party.name).emit(config.CLIENT_GETS.LEAVE_PARTY.name, {
            char_name: socket.character.name
        });
        socket.leave(party.name);

        if (this.middleware.isLeader(socket.character.name, party)) {
            if (party.members.size > 0) {
                party.leader = this.services.pickLeader(socket, party);
                this.io.to(party.name).emit(config.CLIENT_GETS.LEAD_PARTY.name, {
                    char_name: party.leader
                });
            } else {
                // party is disbanded. 
                // remove pending invitations
                for (let [, timeout] of party.invitees) {
                    clearTimeout(timeout);
                }
            }
        } else {
            party.members.delete(socket.character.name);
        }

        this.charToParty.delete(socket.character.name);
    }

    public makeLeader(socket: GameSocket, charName: string, party: PARTY_MODEL) {
        this.io.to(party.name).emit(config.CLIENT_GETS.LEAD_PARTY.name, {
            char_name: charName
        });
        party.leader = charName;
        party.members.delete(charName);
        party.members.add(socket.character.name);
    }

    public kickFromParty(socket: GameSocket, charName: string, party: PARTY_MODEL) {
        this.io.to(party.name).emit(config.CLIENT_GETS.KICK_FROM_PARTY.name, {
            char_name: charName
        });

        let kickedSocket = socket.map.get(charName);
        if (kickedSocket) {
            // party member is online - remove him
            kickedSocket.leave(party.name);
        }
        
        party.members.delete(charName);
        this.charToParty.delete(charName);
    }

    public tellPartyMembers(socket: GameSocket, party: PARTY_MODEL) {
        socket.emit(config.CLIENT_GETS.PARTY_MEMBERS.name, {
            leader_name: party.leader,
            chars_names: Array.from(party.members)
        });
    }

    public getPartyMembersInMap(socket: GameSocket): GameSocket[] {
        let sockets = [];
        let party = this.charToParty.get(socket.character.name);
        if (!party) {
            sockets.push(socket);
        } else {
            let allPartyMembers = this.services.getAllPartyMembers(party);
            for (let memberName of allPartyMembers) {
                let memberSocket = socket.map.get(memberName);
                if (memberSocket && memberSocket.character.room === socket.character.room) {
                    sockets.push(memberSocket);
                }
            }
        }
        return sockets;
    }
};