'use strict';
const master_services_1 = require("../master/master.services");
let config = require('../../../server/lib/stats/stats.config.json');
const _ = require("underscore");
class StatsServices extends master_services_1.default {
    magToMp(mag) {
        return mag * config.MAG_TO_MP_RATIO;
    }
    strToHp(str) {
        return str * config.STR_TO_HP_RATIO;
    }
    getExp(level) {
        return Math.round(this.getAbsoluteExp(level + 1) - this.getAbsoluteExp(level));
    }
    getAbsoluteExp(a) {
        // see http://tibia.wikia.com/wiki/Experience_Formula
        return (50 / 3) * (a * a * a - 6 * a * a + 17 * a - 12);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StatsServices;
;
StatsServices.prototype.getExp = _.memoize(StatsServices.prototype.getExp);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHMuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL3N0YXRzL3N0YXRzLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUNiLCtEQUF1RDtBQUN2RCxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUNwRSxnQ0FBZ0M7QUFFaEMsbUJBQW1DLFNBQVEseUJBQWM7SUFDOUMsT0FBTyxDQUFDLEdBQVc7UUFDdEIsTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDO0lBQ3hDLENBQUM7SUFFTSxPQUFPLENBQUMsR0FBVztRQUN0QixNQUFNLENBQUMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxlQUFlLENBQUM7SUFDeEMsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFhO1FBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBRVMsY0FBYyxDQUFDLENBQVM7UUFDOUIscURBQXFEO1FBQ3JELE1BQU0sQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDNUQsQ0FBQztDQUNKOztBQWpCRCxnQ0FpQkM7QUFBQSxDQUFDO0FBQ0YsYUFBYSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDIn0=