'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
class SocketioModel extends master_model_1.default {
    init(files, app) {
        this.services = files.services;
        this.schema = {};
        this.listenForSchemaAddition("Config");
    }
    get priority() {
        return 5;
    }
    createModel() {
        this.setModel("Config");
        this.removeListen("Config");
        setTimeout(() => this.services.warmConfig());
        return Promise.resolve();
    }
}
exports.default = SocketioModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0aW8ubW9kZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zZXJ2ZXIvbGliL3NvY2tldGlvL3NvY2tldGlvLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFHakQsbUJBQW1DLFNBQVEsc0JBQVc7SUFHbEQsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ1gsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNiLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBRTVCLFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztRQUM3QyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDSjtBQXBCRCxnQ0FvQkM7QUFBQSxDQUFDIn0=