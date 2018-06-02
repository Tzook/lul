
import MasterModel from '../master/master.model';
import { PRIORITY_CHAR } from '../character/character.model';
import { PRIORITY_ROOMS } from '../rooms/rooms.model';

const CHAR_MAIN_ABILITIES = {
    mainAbilities: {type: [String], default: undefined},
};

const ROOM_COMBAT_PROPS = { 
    pvp: Boolean,
    mainable: Boolean,
};

const PRIORITY_COMBAT = PRIORITY_CHAR + PRIORITY_ROOMS + 10;

export default class CombatModel extends MasterModel {

    get priority() {
        return PRIORITY_COMBAT;
    }
    
    createModel() {
        this.addToSchema("Rooms", ROOM_COMBAT_PROPS);
        this.addToSchema("Character", CHAR_MAIN_ABILITIES);
        
        return Promise.resolve();
    }
};