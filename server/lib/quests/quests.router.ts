import SocketioRouterBase from '../socketio/socketio.router.base';
import QuestsMiddleware from './quests.middleware';
import QuestsController from './quests.controller';
import QuestsServices from './quests.services';
import ItemsRouter from '../items/items.router';
import * as _ from 'underscore';
import PartyRouter from '../party/party.router';
import config from './quests.config';
import statsConfig from '../stats/stats.config';
import itemsConfig from '../items/items.config';
import NpcsRouter from '../npcs/npcs.router';

export default class QuestsRouter extends SocketioRouterBase {
	protected middleware: QuestsMiddleware;
	protected controller: QuestsController;
	protected services: QuestsServices;
	protected itemsRouter: ItemsRouter;
    protected partyRouter: PartyRouter;
    protected npcsRouter: NpcsRouter;

	init(files, app) {
		this.services = files.services;
		this.itemsRouter = files.routers.items;
		this.partyRouter = files.routers.party;
		this.npcsRouter = files.routers.npcs;
		super.init(files, app);
	}

	protected initRoutes(app) {
		app.post(this.ROUTES.GENERATE,
			this.middleware.validateHasSercetKey.bind(this.middleware),
			this.controller.generateQuests.bind(this.controller));
	}

	[config.SERVER_GETS.QUEST_START.name](data, socket: GameSocket) {
		let questKey = data.id;
		let npcKey = data.npc;
		let questInfo = this.services.getQuestInfo(questKey);
		let unmetReason;
		if (!questInfo) {
			this.sendError(data, socket, "Could not find a quest with such key, so can't start.");
		} else if (socket.character.quests.progress[questKey]) {
			this.sendError(data, socket, "Already started this quest!");
		} else if (socket.character.quests.done[questKey]) {
			this.sendError(data, socket, "Already finished this quest!");
		} else if (!this.npcsRouter.doesNpcGiveQuest(npcKey, questKey)) {
			this.sendError(data, socket, `The NPC ${npcKey} does not have the quest ${questKey}!`);
		} else if (!this.npcsRouter.isNpcInRoom(npcKey, socket.character.room)) {
			this.sendError(data, socket, `The NPC ${npcKey} must be in your room!`);
		} else if (unmetReason = this.services.questReqUnmetReason(socket.character, questInfo)) {
			this.sendError(data, socket, "Character does not meet the quest requirement: " + unmetReason);
		} else {
			this.services.startQuest(socket.character.quests, questInfo);
			socket.emit(config.CLIENT_GETS.QUEST_START.name, { id: questKey });
		}
	}

	[config.SERVER_GETS.QUEST_DONE.name](data, socket: GameSocket) {
		let questKey = data.id;
		let npcKey = data.npc;
		let questInfo = this.services.getQuestInfo(questKey);
		let unmetReason;
		let slots: {[key: string]: number[]}|false;
		if (!questInfo) {
			this.sendError(data, socket, "Could not find a quest with such key so can't complete.");
		} else if (!socket.character.quests.progress[questKey]) {
			this.sendError(data, socket, "Quest cannot be completed, it is not in progress!");
		} else if (!this.npcsRouter.doesNpcEndQuest(npcKey, questKey)) {
			this.sendError(data, socket, `The NPC ${npcKey} does not have the quest ${questKey}!`);
		} else if (!this.npcsRouter.isNpcInRoom(npcKey, socket.character.room)) {
			this.sendError(data, socket, `The NPC ${npcKey} must be in your room!`);
		} else if (unmetReason = this.services.questFinishUnmetReason(socket.character, this.itemsRouter.getItemsCounts(socket), questInfo)) {
			this.sendError(data, socket, "Quest does not meet finishing criteria: " + unmetReason);
		} else if (!(slots = this.itemsRouter.getItemsSlots(socket, (questInfo.reward || {}).items || []))) {
			this.sendError(data, socket, `There must be ${questInfo.reward.items.length} empty slots for the quest rewards.`);
		} else {
			this.services.finishQuest(socket.character.quests, questInfo);
			socket.emit(config.CLIENT_GETS.QUEST_DONE.name, { id: questKey });
			
			_.forEach((questInfo.cond || {}).loot, (stack, key) => {
				this.emitter.emit(itemsConfig.SERVER_INNER.ITEM_REMOVE.name, {item: { stack, key }}, socket);
			});

			// reward exp
			if ((questInfo.reward || {}).exp) {
				this.emitter.emit(statsConfig.SERVER_INNER.GAIN_EXP.name, { exp: questInfo.reward.exp }, socket);
			}
			
			// reward ability
			if ((questInfo.reward || {}).ability) {
				this.emitter.emit(statsConfig.SERVER_INNER.GAIN_ABILITY.name, { ability: questInfo.reward.ability }, socket);
			}
			
			// reward stats
			if ((questInfo.reward || {}).stats) {
				this.emitter.emit(statsConfig.SERVER_INNER.GAIN_STATS.name, { stats: questInfo.reward.stats }, socket);
			}

			// reward items
			_.forEach((questInfo.reward || {}).items, item => {
				let instance = this.itemsRouter.getItemInstance(item.key);
				if (item.stack > 0) {
					instance.stack = item.stack;
				}
				let itemSlots = slots[item.key];
				this.emitter.emit(itemsConfig.SERVER_INNER.ITEM_ADD.name, { slots: itemSlots, item: instance }, socket);
			});
		}
	}

	[config.SERVER_GETS.QUEST_ABORT.name](data, socket: GameSocket) {
		let questKey = data.id;
		let questInfo = this.services.getQuestInfo(questKey);
		if (!questInfo) {
			this.sendError(data, socket, "Could not find a quest with such key so can't abort.");
		} else if (!socket.character.quests.progress[questKey]) {
			this.sendError(data, socket, "Quest cannot be aborted, it is not in progress!");
		} else {
			this.services.abortQuest(socket.character.quests, questInfo)
			socket.emit(config.CLIENT_GETS.QUEST_ABORT.name, { id: questKey });
		}
	}
	
	[config.SERVER_INNER.HUNT_MOB.name](data, socket: GameSocket) {
		let partySockets = this.partyRouter.getPartyMembersInMap(socket);
        for (let memberSocket of partySockets) {
			let quests = memberSocket.character.quests.hunt[data.id] || {};
            let fields: Set<string> = new Set();
            for (let questKey in quests) {
				let questInfo = this.services.getQuestInfo(questKey);
                if (quests[questKey] < questInfo.cond.hunt[data.id]) {
					quests[questKey]++;
                    memberSocket.emit(config.CLIENT_GETS.QUEST_HUNT_PROGRESS.name, { id: questKey, mob_id: data.id, value: quests[questKey]});
                    fields.add("hunt");
                    console.log("Hunt for quest", data.id, questKey, quests[questKey]);
                }
            }
            this.services.markModified(memberSocket.character.quests, fields);
        }
	}

	[config.SERVER_GETS.QUEST_OK_PROGRESS.name](data, socket: GameSocket) {
		let quests = socket.character.quests.ok[data.ok] || {};
		const increment = data.value > 0 ? data.value : 1;
		let fields: Set<string> = new Set();
		for (let questKey in quests) {
			let questInfo = this.services.getQuestInfo(questKey);
			if (quests[questKey] < questInfo.cond.ok[data.ok]) {
				quests[questKey] = Math.min(quests[questKey] + increment, questInfo.cond.ok[data.ok]);
				socket.emit(config.CLIENT_GETS.QUEST_OK_PROGRESS.name, { id: questKey, ok: data.ok, value: quests[questKey]});
				fields.add("ok");
				console.log("Ok for quest", data.ok, questKey, quests[questKey]);
			}
		}
		this.services.markModified(socket.character.quests, fields);
	}
};
