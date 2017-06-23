'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_middleware_1 = require("../master/master.middleware");
let config = require('../../../server/lib/party/party.config.json');
class PartyMiddleware extends master_middleware_1.default {
    isLeader(name, party) {
        return party.leader === name;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydHkubWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcGFydHkvcGFydHkubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBQzNELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBRXBFLHFCQUFxQyxTQUFRLDJCQUFnQjtJQUNsRCxRQUFRLENBQUMsSUFBWSxFQUFFLEtBQWtCO1FBQzVDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBRU0sV0FBVyxDQUFDLEtBQWtCO1FBQ2pDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksR0FBSSxDQUFDLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDO0lBQy9ELENBQUM7SUFFTSxTQUFTLENBQUMsS0FBa0IsRUFBRSxNQUFrQjtRQUNuRCxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyRCxDQUFDO0NBQ0o7QUFaRCxrQ0FZQztBQUFBLENBQUMifQ==