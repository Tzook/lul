import MasterModel from "../master/master.model";
import * as mongoose from 'mongoose';
import * as _ from 'underscore';
import { setDungeonsInfo } from "./dungeon.services";
import dungeonConfig from "./dungeon.config";

export const PRIORITY_DUNGEON = 10;

const DUNGEON_REWARD_MODEL = (<any>mongoose.Schema)({
    key: String,
    chance: Number,
    stack: Number,
}, {_id: false});

const DUNGEON_ROOM_MODEL = (<any>mongoose.Schema)({
    key: String,
    chance: Number,
}, {_id: false});

const DUNGEON_STAGE_MODEL = (<any>mongoose.Schema)({
    rooms: [DUNGEON_ROOM_MODEL],
    rewards: [DUNGEON_REWARD_MODEL],
}, {_id: false});

const DUNGEON_MODEL = {
    key: String,
    minLvl: Number,
    maxLvl: Number,
    time: Number,
    beginRoom: String,
    stages: [DUNGEON_STAGE_MODEL],
    perksPool: [{}],
    rareBonuses: [String],
};

export default class DungeonModel extends MasterModel {
    init(files, app) {

        this.schema = DUNGEON_MODEL;
    }

    get priority() {
        return PRIORITY_DUNGEON;
    }
    
    createModel() {
        this.setModel('Dungeon');
		setTimeout(warmDungeons); // timeout so the Model can be set
        return Promise.resolve();
    }
};

function warmDungeons(): Promise<any> {
    const DungeonModel = mongoose.model('Dungeon');
    return DungeonModel.find({}).lean()
        .then((docs: DUNGEON[]) => {
            console.log("got dungeons");
            setDungeonsInfo(docs);
        });
}

export function generateDungeons(dungeons: any): Promise<any> {
    console.log("Generating dungeons from data:", dungeons);
    const DungeonModel = mongoose.model('Dungeon');
    
    let dungeonModels = [];

    (dungeons || []).forEach(dungeon => {
        let dungeonSchema: DUNGEON = {
            key: dungeon.key,
            minLvl: +dungeon.minLvl,
            maxLvl: +dungeon.maxLvl,
            time: dungeon.time * 60 * 1000,
            beginRoom: dungeon.beginRoom,
            stages: [],
            perksPool: [],
            rareBonuses: dungeon.rareBonuses || [],
        };

        (dungeon.stages || []).forEach(stage => {
            dungeonSchema.stages.push({
                rooms: getRooms(stage),
                rewards: getRewards(stage),
            });
        });

        addDungeonBonusPerkMaps(dungeonSchema.perksPool, dungeon.perksPool || [], [1]);
        dungeon.perksCombinations.forEach(perksCombination => {
            addDungeonBonusPerkMaps(dungeonSchema.perksPool, dungeon.perksPool || [], perksCombination.multiplyers || []);
        });

        let dungeonModel = new DungeonModel(dungeonSchema);
        dungeonModels.push(dungeonModel);
    });

    return DungeonModel.remove({})
        .then(d => DungeonModel.create(dungeonModels));
};

function getRooms(stage): DUNGEON_ROOM[] {
    const basicRooms: string[] = stage.rooms || [];
    const rareRooms: string[] = stage.rareRooms || [];
    const totalRarity = basicRooms.length * dungeonConfig.DUNGEON_RARE_ROOM_RARITY + rareRooms.length;
    const dungeonBasicRooms: DUNGEON_ROOM[] = basicRooms.map(room => ({
        key: room,
        chance: dungeonConfig.DUNGEON_RARE_ROOM_RARITY / totalRarity,
    }));
    const dungeonRareRooms: DUNGEON_ROOM[] = rareRooms.map(room => ({
        key: room,
        chance: 1 / totalRarity,
    }));
    return dungeonBasicRooms.concat(dungeonRareRooms);
}

function getRewards(stage): DUNGEON_REWARD[] {
    const rewards = stage.rewards || [];
    const totalRarity = _.reduce(rewards, (sum, reward: any) => sum + 1 / (+reward.rarity + 1), 0);
    return rewards.map(reward => ({
        key: reward.key,
        chance: 1 / (+reward.rarity + 1) / totalRarity,
        stack: +reward.stack || 1,
    }));
}

function addDungeonBonusPerkMaps(perkMaps: PERK_MAP[], perksPool: any[], multiplyers: number[]): void {
    addDungeonBonusPerkMapsRecursive(
        perkMaps, 
        {}, 
        perksPool,
        new Set(), 
        multiplyers, 
        0
    );
}
function addDungeonBonusPerkMapsRecursive(perkMaps: PERK_MAP[], currentPerkMap: PERK_MAP, perksPool: any[], blacklistedPerks: Set<string>, multiplyers: number[], multiplyerIndex: number): void {
    if (multiplyerIndex >= multiplyers.length) {
        // finished handling all multiplyers
        perkMaps.push(currentPerkMap);
        return;
    }
    for (let i = 0; i < perksPool.length; i++) {
        const perkObj = perksPool[i];
        if (blacklistedPerks.has(perkObj.key)) {
            continue;
        }
        const value = perkObj.value * multiplyers[multiplyerIndex];

        // TODO check if perk is already at max and skip it
        let newBlacklistPerks = new Set(blacklistedPerks);
        newBlacklistPerks.add(perkObj.key);

        addDungeonBonusPerkMapsRecursive(
            perkMaps, 
            {...currentPerkMap, [perkObj.key]: value},
            perksPool,
            newBlacklistPerks,
            multiplyers,
            multiplyerIndex + 1,
        )
    }
}