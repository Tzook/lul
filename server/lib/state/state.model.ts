import MasterModel from '../master/master.model';
import { PRIORITY_CHAR } from '../character/character.model';

export const PRIORITY_STATE = PRIORITY_CHAR + 10;

const CHAR_VARS_SCHEMA = {};

export default class StateModel extends MasterModel {
    get priority() {
        return PRIORITY_STATE;
    }
    
    createModel() {
        this.addToSchema("Character", { vars: CHAR_VARS_SCHEMA });
        
        this.listenForFieldAddition("Character", "vars");
        
        return Promise.resolve();
    }
    
    protected addFieldToModel(field, data, obj: Char, reqBody) {
        obj.vars = {};
    }
};