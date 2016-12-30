'use strict';
const socketio_router_base_1 = require('../socketio/socketio.router.base');
let config = require('../../../server/lib/equips/equips.config.json');
let itemsConfig = require('../../../server/lib/items/items.config.json');
let SERVER_GETS = config.SERVER_GETS;
class EquipsRouter extends socketio_router_base_1.default {
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EquipsRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXF1aXBzLnJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvZXF1aXBzL2VxdWlwcy5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBQ2IsdUNBQStCLGtDQUFrQyxDQUFDLENBQUE7QUFFbEUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLCtDQUErQyxDQUFDLENBQUM7QUFDdEUsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFDekUsSUFBSSxXQUFXLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQztBQUVyQywyQkFBMEMsOEJBQWtCO0FBRTVELENBQUM7QUFGRDs4QkFFQyxDQUFBO0FBQUEsQ0FBQyJ9