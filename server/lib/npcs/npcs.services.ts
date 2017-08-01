import MasterServices from '../master/master.services';

export default class NpcsServices extends MasterServices {
    private npcsInfo: Map<string, NPC_MODEL> = new Map();

    public updateNpcs(room: string, npcs: any[] = []): Promise<any> {
        let models: NPC_MODEL[] = [];
        npcs.forEach(npc => {
            let npcModel: NPC_MODEL = {
                key: npc.npcKey,
                room,
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
            models.push(new this.Model(npcModel))
        });
        return this.Model.remove({room})
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