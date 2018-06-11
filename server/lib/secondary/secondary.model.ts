import MasterModel from "../master/master.model";

export default class SecondaryModel extends MasterModel {
    createModel() {
        return Promise.resolve();
    }
};
