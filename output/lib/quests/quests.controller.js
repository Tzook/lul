'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_controller_1 = require("../master/master.controller");
class QuestsController extends master_controller_1.default {
    generateQuests(req, res, next) {
        this.services.generateQuests(req.body.quests)
            .then(d => {
            this.sendData(res, this.LOGS.GENERATE, d);
        })
            .catch(e => {
            this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, { e, fn: "generateQuests", file: "quests.controller.js" });
        });
    }
    warmQuestsInfo() {
        this.services.getQuests()
            .catch(e => {
            console.error("Had an error getting quests from the db!");
            throw e;
        });
    }
}
exports.default = QuestsController;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3RzLmNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL3F1ZXN0cy9xdWVzdHMuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBRzNELHNCQUFzQyxTQUFRLDJCQUFnQjtJQUt0RCxjQUFjLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJO1FBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDO2FBQ2pELElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0MsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLENBQUM7WUFDUCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsc0JBQXNCLEVBQUMsQ0FBQyxDQUFDO1FBQy9HLENBQUMsQ0FBQyxDQUFDO0lBQ0YsQ0FBQztJQUVHLGNBQWM7UUFDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7YUFDdkIsS0FBSyxDQUFDLENBQUM7WUFDUCxPQUFPLENBQUMsS0FBSyxDQUFDLDBDQUEwQyxDQUFDLENBQUM7WUFDMUQsTUFBTSxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztJQUNGLENBQUM7Q0FDSjtBQXRCRCxtQ0FzQkM7QUFBQSxDQUFDIn0=