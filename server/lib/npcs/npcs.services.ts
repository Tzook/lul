import MasterServices from '../master/master.services';

export default class NpcsServices extends MasterServices {
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
}; 