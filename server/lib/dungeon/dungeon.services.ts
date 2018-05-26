import MasterServices from "../master/master.services";
import { getServices } from "../main/bootstrap";

export default class DungeonServices extends MasterServices {
	public dungeonsInfo: Map<string, DUNGEON> = new Map();    
}

export function getDungeonServices(): DungeonServices {
    return getServices("dungeon");
}

export function setDungeonsInfo(dungeons: DUNGEON[]) {
    const dungeonServices = getDungeonServices();
    dungeons.forEach(dungeon => {
        dungeonServices.dungeonsInfo.set(dungeon.key, dungeon);
    });
}