'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
const mongoose = require("mongoose");
const stats_model_1 = require("../stats/stats.model");
const QUEST_SCHEMA = {
    key: String,
    cond: {
        loot: mongoose.Schema.Types.Mixed,
        hunt: mongoose.Schema.Types.Mixed,
    },
    req: {
        class: String,
        lvl: Number,
        quests: mongoose.Schema.Types.Mixed
    },
    reward: {
        items: mongoose.Schema.Types.Mixed,
        class: String,
        exp: Number,
        stats: stats_model_1.BASE_STATS_SCHEMA,
        ability: String
    }
};
const CHAR_QUESTS = {
    progress: {},
    done: {},
    hunt: {},
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
        let CharQuestModel = this.createNewModel("CharQuest", CHAR_QUESTS, { _id: false, strict: false, minimize: false });
        this.addToSchema("Character", { quests: CharQuestModel.schema });
        this.listenForFieldAddition("Character", "quests", CHAR_QUESTS);
        setTimeout(() => this.controller.warmQuestsInfo());
        return Promise.resolve();
    }
}
exports.default = QuestsModel;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3RzLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9xdWVzdHMvcXVlc3RzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFFakQscUNBQXFDO0FBQ3JDLHNEQUF5RDtBQUV6RCxNQUFNLFlBQVksR0FBRztJQUNqQixHQUFHLEVBQUUsTUFBTTtJQUNYLElBQUksRUFBRTtRQUNGLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLO1FBQ2pDLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLO0tBQ3BDO0lBQ0QsR0FBRyxFQUFFO1FBQ0QsS0FBSyxFQUFFLE1BQU07UUFDYixHQUFHLEVBQUUsTUFBTTtRQUNYLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLO0tBQ3RDO0lBQ0QsTUFBTSxFQUFFO1FBQ0osS0FBSyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUs7UUFDbEMsS0FBSyxFQUFFLE1BQU07UUFDYixHQUFHLEVBQUUsTUFBTTtRQUNYLEtBQUssRUFBRSwrQkFBaUI7UUFDeEIsT0FBTyxFQUFFLE1BQU07S0FDbEI7Q0FDSixDQUFDO0FBRUYsTUFBTSxXQUFXLEdBQUc7SUFDaEIsUUFBUSxFQUFFLEVBQUU7SUFDWixJQUFJLEVBQUUsRUFBRTtJQUNSLElBQUksRUFBRSxFQUFFO0NBQ1gsQ0FBQztBQUVGLGlCQUFpQyxTQUFRLHNCQUFXO0lBR2hELElBQUksQ0FBQyxLQUFLLEVBQUUsR0FBRztRQUNYLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUVuQyxJQUFJLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQztRQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUN6QixDQUFDO0lBRUQsSUFBSSxRQUFRO1FBQ1IsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNkLENBQUM7SUFFRCxXQUFXO1FBQ1AsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV2QixJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsRUFBRSxXQUFXLEVBQUUsRUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7UUFDakgsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFaEUsVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ25ELE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsQ0FBQztDQUNKO0FBeEJELDhCQXdCQztBQUFBLENBQUMifQ==