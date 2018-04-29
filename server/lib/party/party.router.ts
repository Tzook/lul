
import SocketioRouterBase from '../socketio/socketio.router.base';
import PartyController from './party.controller';
import PartyMiddleware from './party.middleware';
import partyConfig from '../party/party.config';
import knownsConfig from '../knowns/knowns.config';
import { isLeader, isPartyFull, isInvited, isMember } from './party.services';
import { isSocket } from '../talents/talents.services';
import combatConfig from '../combat/combat.config';

export default class PartyRouter extends SocketioRouterBase {
    protected controller: PartyController;
    protected middleware: PartyMiddleware;
    
    [partyConfig.SERVER_GETS.CREATE_PARTY.name](data, socket: GameSocket) {
        if (this.controller.getCharParty(socket)) {
            return this.sendError(data, socket, "Cannot create - character already in party");
        }
        this.controller.createParty(socket);
	}

	[partyConfig.SERVER_GETS.INVITE_TO_PARTY.name](data, socket: GameSocket) {
        let party = this.controller.getCharParty(socket);
        if (!party) {
            return this.sendError(data, socket, "Cannot invite - must be in a party", true, true);
        } else if (!isLeader(socket.character.name, party)) {
            return this.sendError(data, socket, "Cannot invite - must be party leader", true, true);
        } else if (isPartyFull(party)) {
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

	[partyConfig.SERVER_GETS.JOIN_PARTY.name](data, socket: GameSocket) {
        if (this.controller.getCharParty(socket)) {
            return this.sendError(data, socket, "Cannot join - already in party", true, true);
        }

        let party = this.controller.getParty(data.leader_name);
        if (!party) {
            return this.sendError(data, socket, "Cannot join - party is disbanded", true, true);
        } else if (!isInvited(party, socket)) {
            return this.sendError(data, socket, "Cannot join - not invited anymore", true, true);
        } else if (!isLeader(data.leader_name, party)) {
            return this.sendError(data, socket, "Cannot join - party leader has changed", true, true);
        } else if (isPartyFull(party)) {
            return this.sendError(data, socket, "Cannot join - party is full", true, true);
        }
        
        this.emitter.emit(knownsConfig.SERVER_INNER.UPDATE_KNOWN.name, {knowns: party.members}, socket);
        this.controller.joinParty(socket, party);
	}

	[partyConfig.SERVER_GETS.LEAVE_PARTY.name](data, socket: GameSocket) {
        let party = this.controller.getCharParty(socket);
        if (!party) {
            return this.sendError(data, socket, "Cannot leave - must be in a party", true, true);
        }
        this.controller.leaveParty(socket, party);
	}

	[partyConfig.SERVER_GETS.LEAD_PARTY.name](data, socket: GameSocket) {
        let party = this.controller.getCharParty(socket);
        if (!party) {
            return this.sendError(data, socket, "Cannot switch lead - must be in a party", true, true);
        } else if (!isLeader(socket.character.name, party)) {
            return this.sendError(data, socket, "Cannot switch lead - must be party leader", true, true);
        } else if (!isMember(data.char_name, party)) {
            return this.sendError(data, socket, "Cannot switch lead - character not in party", true, true);
        }
        this.controller.makeLeader(data.char_name, party);
	}

	[partyConfig.SERVER_GETS.KICK_FROM_PARTY.name](data, socket: GameSocket) {
        let party = this.controller.getCharParty(socket);
        if (!party) {
            return this.sendError(data, socket, "Cannot kick - must be in a party", true, true);
        } else if (!isLeader(socket.character.name, party)) {
            return this.sendError(data, socket, "Cannot kick - must be party leader", true, true);
        } else if (!isMember(data.char_name, party)) {
            return this.sendError(data, socket, "Cannot kick - character not in party", true, true);
        }
        this.controller.kickFromParty(socket, data.char_name, party);
    }
    
	[partyConfig.SERVER_INNER.DMG_DEALT.name](data: {attacker: HURTER, target: PLAYER, dmg: number, cause: string, crit: boolean}, socket: GameSocket) {
        const {target} = data;
        if (isSocket(target)) {
            const party = this.controller.getCharParty(target);
            if (party) {
                this.io.to(party.name).emit(combatConfig.CLIENT_GETS.DMG_DEALT.name, {
                    name: target.character.name,
                    hp: target.character.stats.hp.now
                });
            }
        }
	}

    public onConnected(socket: GameSocket) {
        // wait 2 ticks - one tick so the user gets his known list and then 2nd tick to tell him about his party members
        process.nextTick(() => process.nextTick(() => {
            let party = this.controller.getCharParty(socket);
            if (party) {
                socket.join(party.name);
                this.controller.tellPartyMembers(socket, party);
            }
        }));
        socket.getKnownsList = socket.getKnownsList || [];
        socket.getKnownsList.push(() => {
            let party = this.controller.getCharParty(socket);
            return party && party.members || [];
        });
    }

    public arePartyMembers(name1: string, name2: string): boolean {
        return this.controller.arePartyMembers(name1, name2);
    }
};
