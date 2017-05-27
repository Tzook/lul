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
			this.services.startQuest(socket.character.quests, questInfo);
			socket.emit(this.CLIENT_GETS.QUEST_START.name, { id: questKey });
			this.services.prefillQuestLoot(socket, questInfo);
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
		} else if (unmetReason = this.services.questFinishUnmetReason(socket.character.quests, questInfo)) {
			this.sendError(data, socket, "Quest does not meet finishing criteria: " + unmetReason);
		// TODO no slots for items
		// } else if () {
		} else {
			this.services.finishQuest(socket.character.quests, questInfo);
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
			this.services.abortQuest(socket.character.quests, questInfo)
			socket.emit(this.CLIENT_GETS.QUEST_ABORT.name, { id: questKey });
			console.log("aborting quest", questKey, socket.character.name);
		}
	}

	[config.SERVER_INNER.LOOT_VALUE_CHANGE.name](data, socket: GameSocket) {
		let quests = socket.character.quests.loot[data.id] || {};
		let fields: Set<string> = new Set();
		for (let questKey in quests) {
			quests[questKey] = Math.max(quests[questKey] + data.value, 0);
            socket.emit(this.CLIENT_GETS.QUEST_PROGRESS.name, { quest_id: questKey, item_id: data.id, value: quests[questKey], type: "loot"});
			fields.add("loot");
		}
		this.services.markModified(socket.character.quests, fields);
	}

	[config.SERVER_INNER.HUNT_MOB.name](data, socket: GameSocket) {
		let quests = socket.character.quests.hunt[data.id] || {};
		let fields: Set<string> = new Set();
		for (let questKey in quests) {
			quests[questKey]++;
            socket.emit(this.CLIENT_GETS.QUEST_PROGRESS.name, { quest_id: questKey, item_id: data.id, value: quests[questKey], type: "hunt"});
			fields.add("hunt");
		}
		this.services.markModified(socket.character.quests, fields);
	}
};
