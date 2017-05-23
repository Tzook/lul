'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_controller_1 = require("../master/master.controller");
class ItemsController extends master_controller_1.default {
    generateItems(req, res, next) {
        this.services.generateItems(req.body.items)
            .then(d => {
            this.sendData(res, this.LOGS.GENERATE_ITEMS, d);
        })
            .catch(e => {
            this.sendError(res, this.LOGS.MASTER_INTERNAL_ERROR, { e, fn: "generateItems", file: "items.controller.js" });
        });
    }
    warmItemsInfo() {
        this.services.getItems()
            .catch(e => {
            console.error("Had an error getting items from the db!");
            throw e;
        });
    }
}
exports.default = ItemsController;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlbXMuY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvaXRlbXMvaXRlbXMuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsbUVBQTJEO0FBRzNELHFCQUFxQyxTQUFRLDJCQUFnQjtJQUtyRCxhQUFhLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJO1FBQzVCLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQy9DLElBQUksQ0FBQyxDQUFDO1lBQ04sSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakQsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLENBQUM7WUFDUCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLHFCQUFxQixFQUFDLENBQUMsQ0FBQztRQUM3RyxDQUFDLENBQUMsQ0FBQztJQUNGLENBQUM7SUFFRyxhQUFhO1FBQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFO2FBQ3RCLEtBQUssQ0FBQyxDQUFDO1lBQ1AsT0FBTyxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO1lBQ3pELE1BQU0sQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Q7QUF0QkQsa0NBc0JDO0FBQUEsQ0FBQyJ9