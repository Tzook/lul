
import MasterServices from '../master/master.services';	
import * as _ from 'underscore';
import config from './quests.config';

export default class QuestsServices extends MasterServices {
	private questsInfo: Map<string, QUEST_MODEL> = new Map();

    public startQuest(quests: CHAR_QUESTS, questInfo: QUEST_MODEL) {
        quests.progress[questInfo.key] = {};
        let fields: Set<string> = new Set(["progress"]);

        for (var mobKey in ((questInfo.cond || {}).hunt || {})) {
            quests.hunt[mobKey] = quests.hunt[mobKey] || {};
            quests.hunt[mobKey][questInfo.key] = 0;
            fields.add("hunt");
        }

        for (var taskKey in ((questInfo.cond || {}).ok || {})) {
            quests.ok[taskKey] = quests.ok[taskKey] || {};
            quests.ok[taskKey][questInfo.key] = 0;
            fields.add("ok");
        }

        this.markModified(quests, fields);
    }

    public finishQuest(quests: CHAR_QUESTS, questInfo: QUEST_MODEL) {
        this.removeQuest(quests, questInfo);
        quests.done[questInfo.key] = {};
        quests.markModified("done");
    }

    public abortQuest(quests: CHAR_QUESTS, questInfo: QUEST_MODEL) {
        this.removeQuest(quests, questInfo);
    }

    private removeQuest(quests: CHAR_QUESTS, questInfo: QUEST_MODEL) {
        delete quests.progress[questInfo.key];
        let fields: Set<string> = new Set(["progress"]);
        for (var mobKey in ((questInfo.cond || {}).hunt || {})) {
            delete quests.hunt[mobKey][questInfo.key];
            if (_.isEmpty(quests.hunt[mobKey])) {
                delete quests.hunt[mobKey];
            }
            fields.add("hunt");
        }
        for (var taskKey in ((questInfo.cond || {}).ok || {})) {
            delete quests.ok[taskKey][questInfo.key];
            if (_.isEmpty(quests.ok[taskKey])) {
                delete quests.ok[taskKey];
            }
            fields.add("ok");
        }
        this.markModified(quests, fields);
    }

    public markModified(quests: CHAR_QUESTS, fields: Set<string>) {
        for (let field of fields) {
            quests.markModified(field);
        }
    }

    public questReqUnmetReason(char: Char, questInfo: QUEST_MODEL): string {
        let req = questInfo.req;
        if (req) {
            // check level requirement
            if (req.lvl && char.stats.lvl < req.lvl) {
                return `level ${char.stats.lvl} / ${req.lvl}`;
            }

            // check pre-quests requirements
            for (var i in (req.quests || [])) {
                let {key, phase} = req.quests[i];
                switch (phase) {
                    case config.REQUIREMENT_PHASE.PROGRESS:
                        if (!char.quests.progress[key]) {
                            return `quest '${key}' must be in progress`;
                        }
                        break;
                    case config.REQUIREMENT_PHASE.NOT_PROGRESS:
                        if (char.quests.progress[key]) {
                            return `quest '${key}' must not be in progress`;
                        }
                        break;
                    case config.REQUIREMENT_PHASE.NOT_COMPLETED:
                        if (char.quests.done[key]) {
                            return `quest '${key}' must not be completed`;
                        }
                        break;
                    default:
                        if (!char.quests.done[key]) {
                            return `quest '${key}' must be completed`;
                        }
                        break;

                }
            }
        }
        return "";
    }

    public questFinishUnmetReason(char: Char, itemsCounts: ITEMS_COUNTS, questInfo: QUEST_MODEL): string {
        for (var itemKey in ((questInfo.cond || {}).loot || {})) {
            let progress = itemKey === "gold" ? char.gold : itemsCounts.get(itemKey);
            let target = questInfo.cond.loot[itemKey];
            if (progress < target) {
                return `loot ${progress} / ${target} ${itemKey}`;
            }
        }
        for (var mobKey in ((questInfo.cond || {}).hunt || {})) {
            let progress = char.quests.hunt[mobKey][questInfo.key];
            let target = questInfo.cond.hunt[mobKey];
            if (progress < target) {
                return `hunt ${progress} / ${target} ${mobKey}`;
            }
        }
        for (var taskKey in ((questInfo.cond || {}).ok || {})) {
            let progress = char.quests.ok[taskKey][questInfo.key];
            let target = questInfo.cond.ok[taskKey];
            if (progress < target) {
                return `task ${progress} / ${target} ${taskKey}`;
            }
        }
        return "";
    }

    // HTTP functions
	// =================
    public generateQuests(quests: any[]): Promise<any> {
		console.log("Generating quests from data:", quests);
		
		let models = [];

		(quests || []).forEach(quest => {
			let questSchema: QUEST_MODEL = { key: quest.key };
            // conditions
            {
                let conditions: QUEST_CONDITIONS = {};
                (quest.conditions || []).forEach(condition => {
                    conditions[condition.condition] = conditions[condition.condition] || {};
                    conditions[condition.condition][condition.conditionType] = +condition.targetProgress;
                    questSchema.cond = conditions;
                });
            }
            // requirements
            {
                let req: QUEST_REQUIREMENTS = {};
                if (quest.minLevel > 0) req.lvl = +quest.minLevel;
                let reqQuests = [];
                (quest.RequiredQuests || []).forEach(reqQuest => {
                    reqQuests.push({key: reqQuest.key, phase: reqQuest.phase});
                    req.quests = reqQuests;
                });
                if (!_.isEmpty(req)) {
                    questSchema.req = req;
                }
            }
            // rewards
            {
                let rewards: QUEST_REWARDS = {};
                if (quest.rewardExp > 0) rewards.exp = +quest.rewardExp;
                if (quest.rewardPrimaryAbility) rewards.ability = quest.rewardPrimaryAbility;

                // stats
                let stats: BASE_STATS_MODEL = {};
                if (quest.rewardSTR > 0) stats.str = +quest.rewardSTR;
                if (quest.rewardMAG > 0) stats.mag = +quest.rewardMAG;
                if (quest.rewardDEX > 0) stats.dex = +quest.rewardDEX;
                if (quest.rewardHP > 0) stats.hp = +quest.rewardHP;
                if (quest.rewardMP > 0) stats.mp = +quest.rewardMP;
                if (!_.isEmpty(stats)) {
                    rewards.stats = stats;
                }

                // items
                let items = [];
                (quest.rewardItems || []).forEach(item => {
                    let rewardItem: ITEM_INSTANCE = { key: item.key };
                    if (item.stack > 1) {
                        rewardItem.stack = +item.stack;
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

	public getQuestInfo(key: string): QUEST_MODEL|undefined {
		return this.questsInfo.get(key);
	}

    public getQuests(): Promise<Map<string, QUEST_MODEL>> {
		return this.Model.find({}).lean()
			.then((docs: QUEST_MODEL[]) => {
				docs.forEach(doc => {
					this.questsInfo.set(doc.key, doc);
				});
				console.log("got quests");
				return this.questsInfo;
			});
	}
};