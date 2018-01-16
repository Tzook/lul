import MasterMiddleware from '../master/master.middleware';

export default class UseMiddleware extends MasterMiddleware {
    public isUseItem(itemInfo: ITEM_MODEL): boolean {
        return !!itemInfo.use;
    }
};