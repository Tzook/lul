'use strict';
import MasterServices from '../master/master.services';	
import * as _ from 'underscore';

export default class QuestsServices extends MasterServices {
	private questsInfo: Map<string, QUEST_MODEL> = new Map();

    public generateQuests(quests: any[]): Promise<any> {
		console.log("Generating quests from data:", quests);
		
		let models = [];

		(quests || []).forEach(quest => {
			let questSchema: QUEST_MODEL = {
				key: quest.key,
			};
            // conditions
            {
                let conditions = [];
                (quest.conditions || []).forEach(condition => {
                    conditions.push({
                        cond: condition.condition,
                        type: condition.conditionType,
                        count: condition.targetProgress
                    });
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