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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3RzLm1vZGVsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9xdWVzdHMvcXVlc3RzLm1vZGVsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYix5REFBaUQ7QUFFakQscUNBQXFDO0FBRXJDLE1BQU0sWUFBWSxHQUFHO0lBQ2pCLEdBQUcsRUFBRSxNQUFNO0lBQ1gsSUFBSSxFQUFFO1FBQ0YsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUs7UUFDakMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUs7S0FDcEM7SUFDRCxHQUFHLEVBQUU7UUFDRCxLQUFLLEVBQUUsTUFBTTtRQUNiLEdBQUcsRUFBRSxNQUFNO1FBQ1gsTUFBTSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUs7S0FDdEM7SUFDRCxNQUFNLEVBQUU7UUFDSixLQUFLLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSztRQUNsQyxLQUFLLEVBQUUsTUFBTTtRQUNiLEdBQUcsRUFBRSxNQUFNO0tBQ2Q7Q0FDSixDQUFDO0FBRUYsTUFBTSxXQUFXLEdBQUc7SUFDaEIsUUFBUSxFQUFFLEVBQUU7SUFDWixJQUFJLEVBQUUsRUFBRTtDQUNYLENBQUM7QUFFRixpQkFBaUMsU0FBUSxzQkFBVztJQUdoRCxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUc7UUFDWCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFFbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLENBQUM7UUFDM0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksUUFBUTtRQUNSLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFdkIsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLEVBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO1FBQ2pILElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQy9ELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRWhFLFVBQVUsQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDSjtBQXhCRCw4QkF3QkM7QUFBQSxDQUFDIn0=