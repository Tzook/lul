
import MasterServices from '../master/master.services';
import * as _ from 'underscore';

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