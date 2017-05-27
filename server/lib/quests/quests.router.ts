'use strict';
import SocketioRouterBase from '../socketio/socketio.router.base';
import QuestsMiddleware from "./quests.middleware";
import QuestsController from "./quests.controller";
import QuestsServices from './quests.services';
let config = require('../../../server/lib/quests/quests.config.json');
let statsConfig = require('../../../server/lib/stats/stats.config.json');

export default class QuestsRouter extends SocketioRouterBase {
    protected middleware: QuestsMiddleware;
	protected controller: QuestsController;
	protected services: QuestsServices;

	init(files, app) {
		this.services = files.services;
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
			let quest = this.services.getCleanQuest(questInfo);
			this.services.prefillQuestLoot(socket.character, quest);
			socket.character.quests.progress[questKey] = quest;
			socket.character.quests.markModified("progress");
			socket.emit(this.CLIENT_GETS.QUEST_START.name, { id: questKey });
			socket.emit(this.CLIENT_GETS.QUEST_PROGRESS.name, { id: questKey, hunt: quest.hunt, loot: quest.loot});
			console.log("started quest", quest, socket.character.name);
		}
	}

	[config.SERVER_GETS.QUEST_DONE.name](data, socket: GameSocket) {
		let questKey = data.id;
		let questInfo = this.services.getQuestInfo(questKey);
		let unmetReason;
		if (!questInfo) {
			this.sendError(data, socket, "Could not find a quest with such key so can't complete.");
		} else if (!socket.character.quests.progress[questKey]) {
			this.sendError(data, socket, "Quest cannot be completed, it is not in progress!");
		} else if (unmetReason = this.services.questFinishUnmetReason(socket.character.quests.progress[questKey], questInfo)) {
			this.sendError(data, socket, "Quest does not meet finishing criteria: " + unmetReason);
		// TODO no slots for items
		// } else if () {
		} else {
			delete socket.character.quests.progress[questKey];
			socket.character.quests.done[questKey] = {};
			socket.character.quests.markModified("progress");
			socket.character.quests.markModified("done");
			socket.emit(this.CLIENT_GETS.QUEST_DONE.name, { id: questKey });
			
			// TODO if had loot cond, remove loot from character

			if (questInfo.reward) {
				if (questInfo.reward.exp) {
					this.emitter.emit(statsConfig.SERVER_INNER.GAIN_EXP.name, { exp: questInfo.reward.exp }, socket);
				}

				// TODO class

				(questInfo.reward.items || []).forEach(item => {
					// TODO items
				});
			}
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
			delete socket.character.quests.progress[questKey];
			socket.character.quests.markModified("progress");
			socket.emit(this.CLIENT_GETS.QUEST_ABORT.name, { id: questKey });
			console.log("aborting quest", questKey, socket.character.name);
		}
	}

	[config.SERVER_INNER.LOOT_VALUE_CHANGE.name](data, socket: GameSocket) {
		let hadChange = false;
		for (var questKey in socket.character.quests.progress) {
			let loot = socket.character.quests.progress[questKey].loot;
			if (loot && loot[data.id] !== undefined) {
				loot[data.id] = Math.max(loot[data.id] + data.value, 0);
				socket.emit(this.CLIENT_GETS.QUEST_PROGRESS.name, { id: questKey, loot});
				hadChange = true;
				console.log("updating quest loot", questKey, loot, socket.character.name);
			}
		}
		hadChange && socket.character.quests.markModified("progress");
	}

	[config.SERVER_INNER.HUNT_MOB.name](data, socket: GameSocket) {
		let hadChange = false;
		for (var questKey in socket.character.quests.progress) {
			let hunt = socket.character.quests.progress[questKey].hunt;
			if (hunt && hunt[data.id] !== undefined) {
				hunt[data.id]++;
				socket.emit(this.CLIENT_GETS.QUEST_PROGRESS.name, { id: questKey, hunt});
				hadChange = true;
				console.log("updating quest hunt", questKey, hunt, socket.character.name);
			}
		}
		hadChange && socket.character.quests.markModified("progress");
	}
};
