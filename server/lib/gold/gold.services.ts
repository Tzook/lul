import MasterServices from '../master/master.services';

export default class GoldServices extends MasterServices {
    public getGoldItem(gold: number): ITEM_INSTANCE {
        return {key: "gold", stack: gold};
    }
};