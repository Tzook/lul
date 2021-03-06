import MasterServices from '../master/master.services';

export default class NpcsServices extends MasterServices {
    private npcsInfo: Map<string, NPC_MODEL> = new Map();

    public doesNpcGiveQuest(npcKey: string, questKey: string): boolean {
        const npc = this.npcsInfo.get(npcKey);
        return npc && npc.givingQuests && npc.givingQuests.indexOf(questKey) !== -1;
    }

    public doesNpcEndQuest(npcKey: string, questKey: string): boolean {
        const npc = this.npcsInfo.get(npcKey);
        return npc && npc.endingQuests && npc.endingQuests.indexOf(questKey) !== -1;
    }

    public isNpcInRoom(npcKey: string, room: string): boolean {
        const npc = this.npcsInfo.get(npcKey);
        return npc && npc.room === room;
    } 


    // HTTP functions
	// =================
    public updateNpcs(room: string, npcs: any[] = [], allRooms: string[]): Promise<any> {
        let models: NPC_MODEL[] = [];
        for (let i = 0; i < npcs.length; i++) {
            let npc = npcs[i];
            let npcModel: NPC_MODEL = {
                key: npc.npcKey,
                room,
                givingQuests: npc.GivingQuests,
                endingQuests: npc.EndingQuests,
            };
            let existingNpc = this.npcsInfo.get(npcModel.key);
            if (existingNpc && existingNpc.room !== npcModel.room) {
                // we have an npc with this key already, in a different room! return an error
                return Promise.reject(`Npc with key ${existingNpc.key} already exists in room ${existingNpc.room}`);
            }

            if (npc.sell && npc.sell.length > 0) {
                let sell: NPC_ITEM[] = [];
                npc.sell.forEach(sellItem => {
                    let item: NPC_ITEM = {
                        key: sellItem.itemKey
                    };
                    sell.push(item);
                });
                npcModel.sell = sell;
            }

            (npc.teleportRooms || []).forEach(teleportRoom => {
                npcModel.teleportRooms = npcModel.teleportRooms || {};
                let {room, portal, party} = teleportRoom;
                let tpRoom: NPC_TELEPORT_ROOM = {portal};
                if (party == "true") {
                    tpRoom.party = true;
                }
                npcModel.teleportRooms[room] = tpRoom;
            });

            models.push(new this.Model(npcModel))
        }
        // both removes can probably be done in one action but w/e
        return this.Model.remove({room})
            .then(d => this.Model.remove({room: {$nin: allRooms}}))
            .then(d => this.Model.insertMany(models));
    }

	public getNpcs(): Promise<Map<string, NPC_MODEL>> {
		return this.Model.find({}).lean()
			.then((docs: NPC_MODEL[]) => {
				docs.forEach(doc => {
					this.npcsInfo.set(doc.key, doc);
				});
				console.log("got npcs");
				return this.npcsInfo;
			});
    }
        
	public getNpcInfo(key: string): NPC_MODEL|undefined {
		return this.npcsInfo.get(key);
    }
}; 