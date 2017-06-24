'use strict';
import MasterMiddleware from '../master/master.middleware';
import config from "./party.config";

export default class PartyMiddleware extends MasterMiddleware {
    public isLeader(name: string, party: PARTY_MODEL): boolean {
        return party.leader === name;
    }

    public isMember(name: string, party: PARTY_MODEL): boolean {
        return party.members.has(name);
    }

    public isInParty(name: string, party: PARTY_MODEL): boolean {
        return this.isLeader(name, party) || this.isMember(name, party); 
    }

    public isPartyFull(party: PARTY_MODEL): boolean {
        return party.members.size  + 1 >= config.MAX_PARTY_MEMBERS;
    }

    public isInvited(party: PARTY_MODEL, socket: GameSocket): boolean {
        return party.invitees.has(socket.character.name);
    }
};