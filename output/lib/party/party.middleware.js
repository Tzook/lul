'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_middleware_1 = require("../master/master.middleware");
let config = require('../../../server/lib/party/party.config.json');
class PartyMiddleware extends master_middleware_1.default {
    isLeader(name, party) {
        return party.leader === name;
    }
    isMember(name, party) {
        return party.members.has(name);
    }
    isInParty(name, party) {
        return this.isLeader(name, party) || this.isMember(name, party);
    }
    isPartyFull(party) {
        return party.members.size + 1 >= config.MAX_PARTY_MEMBERS;
    }
    isInvited(party, socket) {
        return party.invitees.has(socket.character.name);
    }
}
exports.default = PartyMiddleware;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydHkubWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcGFydHkvcGFydHkubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBQzNELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBRXBFLHFCQUFxQyxTQUFRLDJCQUFnQjtJQUNsRCxRQUFRLENBQUMsSUFBWSxFQUFFLEtBQWtCO1FBQzVDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBRU0sUUFBUSxDQUFDLElBQVksRUFBRSxLQUFrQjtRQUM1QyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUVNLFNBQVMsQ0FBQyxJQUFZLEVBQUUsS0FBa0I7UUFDN0MsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFTSxXQUFXLENBQUMsS0FBa0I7UUFDakMsTUFBTSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxHQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsaUJBQWlCLENBQUM7SUFDL0QsQ0FBQztJQUVNLFNBQVMsQ0FBQyxLQUFrQixFQUFFLE1BQWtCO1FBQ25ELE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JELENBQUM7Q0FDSjtBQXBCRCxrQ0FvQkM7QUFBQSxDQUFDIn0=