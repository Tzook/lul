import MasterServices from '../master/master.services';

export default class NpcsServices extends MasterServices {
    private npcsInfo: Map<string, NPC_MODEL> = new Map();

    public updateNpcs(room: string, npcs: {npcKey: string}[] = []): Promise<any> {
        let models: NPC_MODEL[] = [];
        npcs.forEach(npc => {
            let npcModel: NPC_MODEL = {
                key: npc.npcKey,
                room,
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