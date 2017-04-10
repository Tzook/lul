'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_controller_1 = require("../master/master.controller");
let config = require('../../../server/lib/mobs/mobs.config.json');
class MobsController extends master_controller_1.default {
    generateMobs(req, res, next) {
        this.services.generateMobs(req.body.mobs)
            .then(d => {
            this.sendData(res, this.LOGS.GENERATE_MOB, d);
        })
            .catch(e => {
            this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, { e, fn: "generateMobs", file: "mobs.controller.js" });
        });
    }
    warmMobsInfo() {
        let getMobs = () => {
            this.services.getMobs()
                .catch(e => {
                console.error("Had an error getting mobs from the db!");
                throw e;
            });
        };
        getMobs();
        setInterval(getMobs, config.MOBS_REFRESH_INTERVAL);
    }
}
exports.default = MobsController;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9icy5jb250cm9sbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9tb2JzL21vYnMuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBRTNELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0FBRWxFLG9CQUFvQyxTQUFRLDJCQUFnQjtJQUdwRCxZQUFZLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJO1FBQzNCLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQzdDLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLENBQUM7WUFDUCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxjQUFjLEVBQUUsSUFBSSxFQUFFLG9CQUFvQixFQUFDLENBQUMsQ0FBQztRQUMzRyxDQUFDLENBQUMsQ0FBQztJQUNGLENBQUM7SUFFRyxZQUFZO1FBQ2xCLElBQUksT0FBTyxHQUFHO1lBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7aUJBQ3JCLEtBQUssQ0FBQyxDQUFDO2dCQUNQLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztnQkFDeEQsTUFBTSxDQUFDLENBQUM7WUFDVCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLE9BQU8sRUFBRSxDQUFDO1FBRVYsV0FBVyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBQ0Q7QUExQkQsaUNBMEJDO0FBQUEsQ0FBQyJ9