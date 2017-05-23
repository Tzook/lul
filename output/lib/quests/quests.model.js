'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
const mongoose = require("mongoose");
const QUEST_SCHEMA = {
    key: String,
    cond: mongoose.Schema.Types.Mixed,
    req: {
        class: String,
        lvl: Number,
        quests: mongoose.Schema.Types.Mixed
    },
    reward: {
        items: mongoose.Schema.Types.Mixed,
        class: String,
        exp: Number,
    }
};
class QuestsModel extends master_model_1.default {
    init(files, app) {
        this.controller = files.controller;
        this.schema = QUEST_SCHEMA;
        this.minimize = true;
    }
    get priority() {
        return 35;
    }
    createModel() {
        this.setModel("Quest");
        setTimeout(() => this.controller.warmQuestsInfo());
        return Promise.resolve();
    }
}
exports.default = QuestsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3RzLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9xdWVzdHMvcXVlc3RzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFFakQscUNBQXFDO0FBRXJDLE1BQU0sWUFBWSxHQUFHO0lBQ2pCLEdBQUcsRUFBRSxNQUFNO0lBQ1gsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUs7SUFDakMsR0FBRyxFQUFFO1FBQ0QsS0FBSyxFQUFFLE1BQU07UUFDYixHQUFHLEVBQUUsTUFBTTtRQUNYLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLO0tBQ3RDO0lBQ0QsTUFBTSxFQUFFO1FBQ0osS0FBSyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUs7UUFDbEMsS0FBSyxFQUFFLE1BQU07UUFDYixHQUFHLEVBQUUsTUFBTTtLQUNkO0NBQ0osQ0FBQztBQUVGLGlCQUFpQyxTQUFRLHNCQUFXO0lBR2hELElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRztRQUNYLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUVuQyxJQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV2QixVQUFVLENBQUMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDbkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0NBQ0o7QUFwQkQsOEJBb0JDO0FBQUEsQ0FBQyJ9