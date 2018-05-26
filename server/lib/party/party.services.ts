
import MasterServices from '../master/master.services';
import * as _ from 'underscore';
import partyConfig from './party.config';
import { getPartyController } from './party.controller';

export default class PartyServices extends MasterServices {
    public getPartyName() {
        return _.uniqueId("party-");
    }

    public pickLeader(socket: GameSocket, party: PARTY_MODEL): string {
        // get the first member in party that is online
        for (let member of party.members) {
            if (socket.map.get(member)) {
                return member;
            }
        }
        // no one is online - pick the first one
        return party.members.values().next().value;
    }
};

export function getCharParty(socket: GameSocket) {
    return getPartyController().getCharParty(socket);
}

export function getPartyMembersInMap(socket: GameSocket, includeDead: boolean = false): GameSocket[] {
    let sockets = [];
    let party = getCharParty(socket);
    if (!party) {
        sockets.push(socket);
    } else {
        for (let memberName of party.members) {
            let memberSocket = socket.map.get(memberName);
            if (memberSocket && memberSocket.character.room === socket.character.room && (includeDead || memberSocket.alive)) {
                sockets.push(memberSocket);
            }
        }
    }
    return sockets;
}

export function isPartyLeader(socket: GameSocket, party: PARTY_MODEL): boolean {
    return isLeader(socket.character.name, party);
}

export function isLeader(name: string, party: PARTY_MODEL): boolean {
    return party.leader === name;
}

export function isMember(name: string, party: PARTY_MODEL): boolean {
    return party.members.has(name);
}

export function isPartyFull(party: PARTY_MODEL): boolean {
    return party.members.size  + 1 >= partyConfig.MAX_PARTY_MEMBERS;
}

export function isInvited(party: PARTY_MODEL, socket: GameSocket): boolean {
    return party.invitees.has(socket.character.name);
}