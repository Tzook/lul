'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
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
    lvlUp(stats) {
        stats.lvl++;
        let str, dex, mag;
        str = dex = mag = config.LEVEL_UP_STAT_BONUS;
        stats.str += str;
        stats.dex += dex;
        stats.mag += mag;
        stats.hp.now = stats.hp.total = stats.hp.total + this.strToHp(str);
        stats.mp.now = stats.mp.total = stats.mp.total + this.magToMp(mag);
        console.log("Level up", stats);
    }
}
exports.default = StatsServices;
;
StatsServices.prototype.getExp = _.memoize(StatsServices.prototype.getExp);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHMuc2VydmljZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL3N0YXRzL3N0YXRzLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFDdkQsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFDcEUsZ0NBQWdDO0FBRWhDLG1CQUFtQyxTQUFRLHlCQUFjO0lBQzlDLE9BQU8sQ0FBQyxHQUFXO1FBQ3RCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBQztJQUN4QyxDQUFDO0lBRU0sT0FBTyxDQUFDLEdBQVc7UUFDdEIsTUFBTSxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDO0lBQ3hDLENBQUM7SUFFTSxNQUFNLENBQUMsS0FBYTtRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVTLGNBQWMsQ0FBQyxDQUFTO1FBQzlCLHFEQUFxRDtRQUNyRCxNQUFNLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFTSxLQUFLLENBQUMsS0FBWTtRQUNyQixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFWixJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO1FBQ2xCLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQztRQUM3QyxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQztRQUNqQixLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQztRQUNqQixLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQztRQUNqQixLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25FLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDbkMsQ0FBQztDQUNKO0FBL0JELGdDQStCQztBQUFBLENBQUM7QUFDRixhQUFhLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBUSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMifQ==