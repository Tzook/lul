'use strict';
const master_services_1 = require("../master/master.services");
let config = require('../../../server/lib/stats/stats.config.json');
class StatsServices extends master_services_1.default {
    magToMp(mag) {
        return mag * config.MAG_TO_MP_RATIO;
    }
    strToHp(str) {
        return str * config.STR_TO_HP_RATIO;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StatsServices;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHMuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL3N0YXRzL3N0YXRzLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLCtEQUF1RDtBQUN2RCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUVwRSxtQkFBbUMsU0FBUSx5QkFBYztJQUM5QyxPQUFPLENBQUMsR0FBVztRQUN0QixNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7SUFDeEMsQ0FBQztJQUVNLE9BQU8sQ0FBQyxHQUFXO1FBQ3RCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQztJQUN4QyxDQUFDO0NBQ0o7O0FBUkQsZ0NBUUM7QUFBQSxDQUFDIn0=