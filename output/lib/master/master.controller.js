'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_response_1 = require("./master.response");
class MasterController extends master_response_1.default {
    init(files, app) {
        super.init(files, app);
        this.io = app.socketio;
    }
}
exports.default = MasterController;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFzdGVyLmNvbnRyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL21hc3Rlci9tYXN0ZXIuY29udHJvbGxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7O0FBQ2IsdURBQXlDO0FBRXpDLHNCQUFzQyxTQUFRLHlCQUFRO0lBR2xELElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRztRQUNYLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQztJQUMzQixDQUFDO0NBQ0o7QUFQRCxtQ0FPQztBQUFBLENBQUMifQ==