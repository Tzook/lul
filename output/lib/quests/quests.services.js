'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const master_services_1 = require("../master/master.services");
const _ = require("underscore");
class QuestsServices extends master_services_1.default {
    constructor() {
        super(...arguments);
        this.questsInfo = new Map();
    }
    questReqUnmetReason(char, questInfo) {
        let req = questInfo.req;
        if (req) {
            if (req.lvl && char.stats.lvl < req.lvl) {
                return `level ${char.stats.lvl} / ${req.lvl}`;
            }
            for (var i in (req.quests || [])) {
                let reqQuest = req.quests[i];
                if (!char.quests.done[reqQuest]) {
                    return `quest id '${reqQuest}'`;
                }
            }
        }
        return "";
    }
    getCleanQuest(questInfo) {
        let progress = {};
        if (questInfo.cond) {
            for (var itemKey in (questInfo.cond.loot || {})) {
                progress.loot = progress.loot || {};
                progress.loot[itemKey] = 0;
            }
            for (var mobKey in (questInfo.cond.hunt || {})) {
                progress.hunt = progress.hunt || {};
                progress.hunt[mobKey] = 0;
            }
        }
        return progress;
    }
    prefillQuestLoot(char, quest) {
        if (quest.loot) {
            char.items.forEach(item => {
                if (quest.loot[item.key] !== undefined) {
                    quest.loot[item.key] += item.stack || 1;
                }
            });
        }
    }
    questFinishUnmetReason(questProgress, questInfo) {
        for (var itemKey in (questProgress.loot || {})) {
            let progress = questProgress.loot[itemKey];
            let target = questInfo.cond.loot[itemKey];
            if (progress < target) {
                return `loot ${progress} / ${target} ${itemKey}`;
            }
        }
        for (var mobKey in (questProgress.hunt || {})) {
            let progress = questProgress.hunt[mobKey];
            let target = questInfo.cond.hunt[mobKey];
            if (progress < target) {
                return `hunt ${progress} / ${target} ${mobKey}`;
            }
        }
        return "";
    }
    generateQuests(quests) {
        console.log("Generating quests from data:", quests);
        let models = [];
        (quests || []).forEach(quest => {
            let questSchema = {
                key: quest.key,
            };
            {
                let conditions = {};
                (quest.conditions || []).forEach(condition => {
                    conditions[condition.condition] = conditions[condition.condition] || {};
                    conditions[condition.condition][condition.conditionType] = condition.targetProgress;
                    questSchema.cond = conditions;
                });
                console.log(questSchema.cond);
            }
            {
                let req = {};
                if (quest.minLevel > 0) {
                    req.lvl = quest.minLevel;
                }
                if (quest.requiredClass) {
                    req.class = quest.requiredClass;
                }
                let reqQuests = [];
                (quest.RequiredQuests || []).forEach(reqQuest => {
                    reqQuests.push(reqQuest.key);
                    req.quests = reqQuests;
                });
                if (!_.isEmpty(req)) {
                    questSchema.req = req;
                }
            }
            {
                let rewards = {};
                if (quest.rewardClass) {
                    rewards.class = quest.rewardClass;
                }
                if (quest.rewardExp > 0) {
                    rewards.exp = quest.rewardExp;
                }
                let items = [];
                (quest.rewardItems || []).forEach(item => {
                    let rewardItem = {
                        key: item.key,
                    };
                    if (item.stack > 1) {
                        rewardItem.stack = item.stack;
                    }
                    items.push(rewardItem);
                    rewards.items = items;
                });
                if (!_.isEmpty(rewards)) {
                    questSchema.reward = rewards;
                }
            }
            let questModel = new this.Model(questSchema);
            models.push(questModel);
        });
        return this.Model.remove({})
            .then(d => this.Model.create(models));
    }
    getQuestInfo(key) {
        return this.questsInfo.get(key);
    }
    getQuests() {
        return this.Model.find({}).lean()
            .then((docs) => {
            docs.forEach(doc => {
                this.questsInfo.set(doc.key, doc);
            });
            console.log("got quests");
            return this.questsInfo;
        });
    }
}
exports.default = QuestsServices;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3RzLnNlcnZpY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc2VydmVyL2xpYi9xdWVzdHMvcXVlc3RzLnNlcnZpY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQzs7QUFDYiwrREFBdUQ7QUFDdkQsZ0NBQWdDO0FBRWhDLG9CQUFvQyxTQUFRLHlCQUFjO0lBQTFEOztRQUNTLGVBQVUsR0FBNkIsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQXNKMUQsQ0FBQztJQXBKVSxtQkFBbUIsQ0FBQyxJQUFVLEVBQUUsU0FBc0I7UUFDekQsSUFBSSxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQztRQUN4QixFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ04sRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsTUFBTSxDQUFDLFNBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO1lBQ2xELENBQUM7WUFJRCxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDOUIsTUFBTSxDQUFDLGFBQWEsUUFBUSxHQUFHLENBQUM7Z0JBQ3BDLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDZCxDQUFDO0lBRU0sYUFB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