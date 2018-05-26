
import MasterController from '../master/master.controller';
import PartyServices, { isMember, isLeader } from './party.services';
import PartyMiddleware from './party.middleware';
import config from './party.config';
import { getController } from '../main/bootstrap';

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
        let cachedKickLocked = 0;
        let party: PARTY_MODEL = {
            name: this.services.getPartyName(),
            leader: socket.character.name,
            members: new Set([socket.character.name]),
            invitees: new Map(),
            get kickLocked() {
                return !!cachedKickLocked;
            },
            set kickLocked(value: boolean) {
                if (value) {
                    cachedKickLocked++;
                } else {
                    cachedKickLocked--;
                }
            },
        };
        this.charToParty.set(socket.character.name, party);
        socket.join(party.name);
    }

    public inviteToParty(inviteeSocket: GameSocket, party: PARTY_MODEL) {
        inviteeSocket.emit(config.CLIENT_GETS.INVITE_TO_PARTY.name, {
            leader_name: party.leader
        });
        party.invitees.set(inviteeSocket.character.name, setTimeout(() => {
            // remove the invitation after a certain amount of time
            party.invitees.delete(inviteeSocket.character.name);
        }, config.INVITE_EXPIRE_TIME));
    }

    public joinParty(socket: GameSocket, party: PARTY_MODEL) {
        socket.join(party.name);

        party.members.add(socket.character.name);
        this.tellPartyMembers(socket, party);
        this.io.to(party.name).emit(config.CLIENT_GETS.JOIN_PARTY.name, {
            char_name: socket.character.name
        });

        this.charToParty.set(socket.character.name, party);
        clearTimeout(party.invitees.get(socket.character.name));
        party.invitees.delete(socket.character.name);
    }

    public leaveParty(socket: GameSocket, party: PARTY_MODEL) {
        this.io.to(party.name).emit(config.CLIENT_GETS.LEAVE_PARTY.name, {
            char_name: socket.character.name
        });
        socket.leave(party.name);

        party.members.delete(socket.character.name);
        if (isLeader(socket.character.name, party)) {
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
        }

        this.charToParty.delete(socket.character.name);
    }

    public makeLeader(charName: string, party: PARTY_MODEL) {
        this.io.to(party.name).emit(config.CLIENT_GETS.LEAD_PARTY.name, {
            char_name: charName
        });
        party.leader = charName;
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

    public arePartyMembers(name1: string, name2: string): boolean {
        let areMembers = false;
        let party = this.getParty(name1);
        if (party) {
            areMembers = isMember(name2, party);
        }
        return areMembers;
    }
};

export function getPartyController(): PartyController {
    return getController("party");
}