'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const socketio_router_base_1 = require("../socketio/socketio.router.base");
let config = require('../../../server/lib/quests/quests.config.json');
let statsConfig = require('../../../server/lib/stats/stats.config.json');
class QuestsRouter extends socketio_router_base_1.default {
    init(files, app) {
        this.services = files.services;
        super.init(files, app);
    }
    initRoutes(app) {
        app.post(this.ROUTES.GENERATE, this.middleware.validateHasSercetKey.bind(this.middleware), this.controller.generateQuests.bind(this.controller));
    }
    [config.SERVER_GETS.QUEST_START.name](data, socket) {
        let questKey = data.id;
        let questInfo = this.services.getQuestInfo(questKey);
        let unmetReason;
        if (!questInfo) {
            this.sendError(data, socket, "Could not find a quest with such key, so can't start.");
        }
        else if (socket.character.quests.progress[questKey]) {
            this.sendError(data, socket, "Already started this quest!");
        }
        else if (socket.character.quests.done[questKey]) {
            this.sendError(data, socket, "Already finished this quest!");
        }
        else if (unmetReason = this.services.questReqUnmetReason(socket.character, questInfo)) {
            this.sendError(data, socket, "Character does not meet the quest requirement: " + unmetReason);
        }
        else {
            this.services.startQuest(socket.character.quests, questInfo);
            socket.emit(this.CLIENT_GETS.QUEST_START.name, { id: questKey });
            this.services.prefillQuestLoot(socket, questInfo);
        }
    }
    [config.SERVER_GETS.QUEST_DONE.name](data, socket) {
        let questKey = data.id;
        let questInfo = this.services.getQuestInfo(questKey);
        let unmetReason;
        if (!questInfo) {
            this.sendError(data, socket, "Could not find a quest with such key so can't complete.");
        }
        else if (!socket.character.quests.progress[questKey]) {
            this.sendError(data, socket, "Quest cannot be completed, it is not in progress!");
        }
        else if (unmetReason = this.services.questFinishUnmetReason(socket.character.quests, questInfo)) {
            this.sendError(data, socket, "Quest does not meet finishing criteria: " + unmetReason);
        }
        else {
            this.services.finishQuest(socket.character.quests, questInfo);
            socket.emit(this.CLIENT_GETS.QUEST_DONE.name, { id: questKey });
            if (questInfo.reward) {
                if (questInfo.reward.exp) {
                    this.emitter.emit(statsConfig.SERVER_INNER.GAIN_EXP.name, { exp: questInfo.reward.exp }, socket);
                }
                (questInfo.reward.items || []).forEach(item => {
                });
            }
            console.log("completed quest", questKey, socket.character.name);
        }
    }
    [config.SERVER_GETS.QUEST_ABORT.name](data, socket) {
        let questKey = data.id;
        let questInfo = this.services.getQuestInfo(questKey);
        if (!questInfo) {
            this.sendError(data, socket, "Could not find a quest with such key so can't abort.");
        }
        else if (!socket.character.quests.progress[questKey]) {
            this.sendError(data, socket, "Quest cannot be aborted, it is not in progress!");
        }
        else {
            this.services.abortQuest(socket.character.quests, questInfo);
            socket.emit(this.CLIENT_GETS.QUEST_ABORT.name, { id: questKey });
            console.log("aborting quest", questKey, socket.character.name);
        }
    }
    [config.SERVER_INNER.LOOT_VALUE_CHANGE.name](data, socket) {
        let quests = socket.character.quests.loot[data.id] || {};
        let fields = new Set();
        for (let questKey in quests) {
            quests[questKey] = Math.max(quests[questKey] + data.value, 0);
            socket.emit(this.CLIENT_GETS.QUEST_PROGRESS.name, { quest_id: questKey, item_id: data.id, value: quests[questKey], type: "loot" });
            fields.add("loot");
        }
        this.services.markModified(socket.character.quests, fields);
    }
    [config.SERVER_INNER.HUNT_MOB.name](data, socket) {
        let quests = socket.character.quests.hunt[data.id] || {};
        let fields = new Set();
        for (let questKey in quests) {
            quests[questKey]++;
            socket.emit(this.CLIENT_GETS.QUEST_PROGRESS.name, { quest_id: questKey, item_id: data.id, value: quests[questKey], type: "hunt" });
            fields.add("hunt");
        }
        this.services.markModified(socket.character.quests, fields);
    }
}
exports.default = QuestsRouter;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3RzLnJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NlcnZlci9saWIvcXVlc3RzL3F1ZXN0cy5yb3V0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDOztBQUNiLDJFQUFrRTtBQUlsRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsK0NBQStDLENBQUMsQ0FBQztBQUN0RSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUV6RSxrQkFBa0MsU0FBUSw4QkFBa0I7SUFLM0QsSUFBSSxDQUFDLEtBQUssRUFBRSxHQUFHO1FBQ2QsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO1FBQy9CLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFUyxVQUFVLENBQUMsR0FBRztRQUN2QixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQzFELElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsTUFBa0I7UUFDN0QsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUN2QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyRCxJQUFJLFdBQVcsQ0FBQztRQUNoQixFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDaEIs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