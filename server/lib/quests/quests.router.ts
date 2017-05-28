'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import QuestsMiddleware from "./quests.middleware";
import QuestsController from "./quests.controller";
import QuestsServices from './quests.services';
import ItemsRouter from '../items/items.router';
import * as _ from 'underscore';
let config = require('../../../server/lib/quests/quests.config.json');
let statsConfig = require('../../../server/lib/stats/stats.config.json');
let itemsConfig = require('../../../server/lib/items/items.config.json');

export default class QuestsRouter extends SocketioRouterBase {
	protected middleware: QuestsMiddleware;
	protected controller: QuestsController;
	protected services: QuestsServices;
	protected itemsRouter: ItemsRouter;

	init(files, app) {
		this.services = files.services;
		this.itemsRouter = files.routers.items;
		super.init(files, app);
	}

	protected initRoutes(app) {
		app.post(this.ROUTES.GENERATE,
			this.middleware.validateHasSercetKey.bind(this.middleware),
			this.controller.generateQuests.bind(this.controller));
	}

	[config.SERVER_GETS.QUEST_START.name](data, socket: GameSocket) {
		let questKey = data.id;
		let questInfo = this.services.getQuestInfo(questKey);
		let unmetReason;
		if (!questInfo) {
			this.sendError(data, socket, "Could not find a quest with such key, so can't start.");
		} else if (socket.character.quests.progress[questKey]) {
			this.sendError(data, socket, "Already started this quest!");
		} else if (socket.character.quests.done[questKey]) {
			this.sendError(data, socket, "Already finished this quest!");
		} else if (unmetReason = this.services.questReqUnmetReason(socket.character, questInfo)) {
			this.sendError(data, socket, "Character does not meet the quest requirement: " + unmetReason);
		} else {
			this.services.startQuest(socket.character.quests, questInfo);
			socket.emit(this.CLIENT_GETS.QUEST_START.name, { id: questKey });
		}
	}

	[config.SERVER_GETS.QUEST_DONE.name](data, socket: GameSocket) {
		let questKey = data.id;
		let questInfo = this.services.getQuestInfo(questKey);
		let unmetReason;
		let slots: {[key: string]: number[]}|false;
		if (!questInfo) {
			this.sendError(data, socket, "Could not find a quest with such key so can't complete.");
		} else if (!socket.character.quests.progress[questKey]) {
			this.sendError(data, socket, "Quest cannot be completed, it is not in progress!");
		} else if (unmetReason = this.services.questFinishUnmetReason(socket.character, this.itemsRouter.getItemsCounts(socket), questInfo)) {
			this.sendError(data, socket, "Quest does not meet finishing criteria: " + unmetReason);
		} else if (!(slots = this.itemsRouter.getItemsSlots(socket, (questInfo.reward || {}).items || []))) {
			this.sendError(data, socket, `There must be ${questInfo.reward.items.length} empty slots for the quest rewards.`);
		} else {
			this.services.finishQuest(socket.character.quests, questInfo);
			socket.emit(this.CLIENT_GETS.QUEST_DONE.name, { id: questKey });
			
			_.forEach((questInfo.cond || {}).loot, (stack, itemId) => {
				this.emitter.emit(itemsConfig.SERVER_INNER.ITEM_REMOVE.name, { stack, itemId }, socket);
			});

			if ((questInfo.reward || {}).exp) {
				this.emitter.emit(statsConfig.SERVER_INNER.GAIN_EXP.name, { exp: questInfo.reward.exp }, socket);
			}

			// TODO class

			_.forEach((questInfo.reward || {}).items, item => {
				let instance = this.itemsRouter.getItemInstance(item.key);
				if (item.stack > 0) {
					instance.stack = item.stack;
				}
				let itemSlots = slots[item.key];
				this.emitter.emit(itemsConfig.SERVER_INNER.ITEM_ADD.name, { slots: itemSlots, item: instance }, socket);
			});
			console.log("completed quest", questKey, socket.character.name);
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
			socket.emit(this.CLIENT_GETS.QUEST_ABORT.name, { id: questKey });
			console.log("aborting quest", questKey, socket.character.name);
		}
	}

	[config.SERVER_INNER.HUNT_MOB.name](data, socket: GameSocket) {
		let quests = socket.character.quests.hunt[data.id] || {};
		let fields: Set<string> = new Set();
		for (let questKey in quests) {
			quests[questKey]++;
            socket.emit(this.CLIENT_GETS.QUEST_HUNT_PROGRESS.name, { id: questKey, mob_id: data.id, value: quests[questKey]});
			fields.add("hunt");
			console.log("Hunt for quest", data.id, questKey, quests[questKey]);
		}
		this.services.markModified(socket.character.quests, fields);
	}
};
