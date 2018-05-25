import MasterServices from "../master/master.services";
import { getServices } from "../main/bootstrap";

export default class DungeonServices extends MasterServices {
}

export function getDungeonServices(): DungeonServices {
    return getServices("dungeon");
}