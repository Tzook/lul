'use strict';
import MasterServices from '../master/master.services';	
import * as _ from 'underscore';
let config = require('../../../server/lib/quests/quests.config.json');

export default class QuestsServices extends MasterServices {
	private questsInfo: Map<string, QUEST_MODEL> = new Map();

    public startQuest(quests: CHAR_QUESTS, questInfo: QUEST_MODEL) {
        quests.progress[questInfo.key] = {};
        let fields: Set<string> = new Set(["progress"]);
			
        for (var itemKey in ((questInfo.cond || {}).loot || {})) {
            quests.loot[itemKey] = quests.loot[itemKey] || {};
            quests.loot[itemKey][questInfo.key] = 0;
            fields.add("loot");
        }
        for (var mobKey in ((questInfo.cond || {}).hunt || {})) {
            quests.hunt[mobKey] = quests.hunt[mobKey] || {};
            quests.hunt[mobKey][questInfo.key] = 0;
            fields.add("hunt");
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
			
        for (var itemKey in ((questInfo.cond || {}).loot || {})) {
            delete quests.loot[itemKey][questInfo.key];
            if (_.isEmpty(quests.loot[itemKey])) {
                delete quests.loot[itemKey];
            }
            fields.add("loot");
        }
        for (var mobKey in ((questInfo.cond || {}).hunt || {})) {
            delete quests.hunt[mobKey][questInfo.key];
            if (_.isEmpty(quests.hunt[mobKey])) {
                delete quests.hunt[mobKey];
            }
            fields.add("hunt");
        }
        this.markModified(quests, fields);
    }

    public prefillQuestLoot(socket: GameSocket, questInfo: QUEST_MODEL) {
        let itemsToReport: Set<string> = new Set();
        let fields: Set<string> = new Set();
        if ((questInfo.cond || {}).loot) {
            socket.character.items.forEach(item => {
                if (questInfo.cond.loot[item.key]) {
                    socket.character.quests.loot[item.key][questInfo.key] += item.stack || 1;
                    itemsToReport.add(item.key);
                    fields.add("loot");
                }
            });
        }
        for (let itemKey of itemsToReport) {
            socket.emit(config.CLIENT_GETS.QUEST_PROGRESS.name, { 
                quest_id: questInfo.key, 
                item_id: itemKey, 
                value: socket.character.quests.loot[itemKey][questInfo.key],
                type: "loot"
            });
        }
        this.markModified(socket.character.quests, fields);
    }

    public markModified(quests: CHAR_QUESTS, fields: Set<string>) {
        for (let field of fields) {
            quests.markModified(field);
        }
    }

    public questReqUnmetReason(char: Char, questInfo: QUEST_MODEL): string {
        let req = questInfo.req;
        if (req) {
            if (req.lvl && char.stats.lvl < req.lvl) {
                return `level ${char.stats.lvl} / ${req.lvl}`;
            }

            // TODO add class check

            for (var i in (req.quests || [])) {
                let reqQuest = req.quests[i];
                if (!char.quests.done[reqQuest]) {
                    return `quest id '${reqQuest}'`;
                }
            }
        }
        return "";
    }

    public questFinishUnmetReason(quests: CHAR_QUESTS, questInfo: QUEST_MODEL): string {
        for (var itemKey in ((questInfo.cond || {}).loot || {})) {
            let progress = quests.loot[itemKey][questInfo.key];
            let target = questInfo.cond.loot[itemKey];
            if (progress < target) {
                return `loot ${progress} / ${target} ${itemKey}`;
            }
        }
        for (var mobKey in ((questInfo.cond || {}).hunt || {})) {
            let progress = quests.hunt[mobKey][questInfo.key];
            let target = questInfo.cond.hunt[mobKey];
            if (progress < target) {
                return `hunt ${progress} / ${target} ${mobKey}`;
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
			let questSchema: QUEST_MODEL = {
				key: quest.key,
			};
            // conditions
            {
                let conditions: QUEST_CONDITIONS = {};
                (quest.conditions || []).forEach(condition => {
                    conditions[condition.condition] = conditions[condition.condition] || {};
                    conditions[condition.condition][condition.conditionType] = condition.targetProgress;
                    questSchema.cond = conditions;
                });
            }
            // requirements
            {
                let req: QUEST_REQUIREMENTS = {};
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
            // rewards
            {
                let rewards: QUEST_REWARDS = {};
                if (quest.rewardClass) {
                    rewards.class = quest.rewardClass
                }
                if (quest.rewardExp > 0) {
                    rewards.exp = quest.rewardExp
                }
                let items = [];
                (quest.rewardItems || []).forEach(item => {
                    let rewardItem: ITEM_INSTANCE = {
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