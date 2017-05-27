'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_model_1 = require("../master/master.model");
const mongoose = require("mongoose");
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
    }
};
const CHAR_QUESTS = {
    progress: {},
    done: {},
    loot: {},
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3RzLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9xdWVzdHMvcXVlc3RzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFFakQscUNBQXFDO0FBRXJDLE1BQU0sWUFBWSxHQUFHO0lBQ2pCLEdBQUcsRUFBRSxNQUFNO0lBQ1gsSUFBSSxFQUFFO1FBQ0YsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUs7UUFDakMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUs7S0FDcEM7SUFDRCxHQUFHLEVBQUU7UUFDRCxLQUFLLEVBQUUsTUFBTTtRQUNiLEdBQUcsRUFBRSxNQUFNO1FBQ1gsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUs7S0FDdEM7SUFDRCxNQUFNLEVBQUU7UUFDSixLQUFLLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSztRQUNsQyxLQUFLLEVBQUUsTUFBTTtRQUNiLEdBQUcsRUFBRSxNQUFNO0tBQ2Q7Q0FDSixDQUFDO0FBRUYsTUFBTSxXQUFXLEdBQUc7SUFDaEIsUUFBUSxFQUFFLEVBQUU7SUFDWixJQUFJLEVBQUUsRUFBRTtJQUNSLElBQUksRUFBRSxFQUFFO0lBQ1IsSUFBSSxFQUFFLEVBQUU7Q0FDWCxDQUFDO0FBRUYsaUJBQWlDLFNBQVEsc0JBQVc7SUFHaEQsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ1gsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBRW5DLElBQUksQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDO1FBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxJQUFJLFFBQVE7UUFDUixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXZCLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxFQUFFLFdBQVcsRUFBRSxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztRQUNqSCxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsRUFBRSxFQUFDLE1BQU0sRUFBRSxjQUFjLENBQUMsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUVoRSxVQUFVLENBQUMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDbkQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0NBQ0o7QUF4QkQsOEJBd0JDO0FBQUEsQ0FBQyJ9