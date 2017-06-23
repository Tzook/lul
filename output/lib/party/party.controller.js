'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_controller_1 = require("../master/master.controller");
class PartyController extends master_controller_1.default {
    constructor() {
        super(...arguments);
        this.partyToChars = new Map();
        this.charToParty = new Map();
    }
}
exports.default = PartyController;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydHkuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcGFydHkvcGFydHkuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBRTNELHFCQUFxQyxTQUFRLDJCQUFnQjtJQUE3RDs7UUFDWSxpQkFBWSxHQUEwQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2hELGdCQUFXLEdBQXdCLElBQUksR0FBRyxFQUFFLENBQUM7SUFFekQsQ0FBQztDQUFBO0FBSkQsa0NBSUM7QUFBQSxDQUFDIn0=