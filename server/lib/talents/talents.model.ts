import * as mongoose from "mongoose";
import { PRIORITY_CHAR } from "../character/character.model";
import MasterModel from "../master/master.model";
import { PRIORITY_MOBS } from "../mobs/mobs.model";
import { PRIORITY_ROOMS } from "../rooms/rooms.model";
import { PRIORITY_CONFIG } from "../socketio/socketio.model";
import statsConfig from "../stats/stats.config";
import talentsConfig from "./talents.config";
import TalentsController from "./talents.controller";
import TalentsServices from "./talents.services";

const ABILITY_PERK_SCHEMA = new mongoose.Schema(
    {
        atLeastLvl: Number,
        perksOffered: Number,
        addToPool: [String],
    },
    { _id: false },
);

const TALENT_SCHEMA = {
    ability: String,
    perks: [ABILITY_PERK_SCHEMA],
    info: {
        powerType: String,
        hitType: String,
        mp: Number,
        initPerks: {},
    },
};

const CONFIG_PERK_SCHEMA = {};

const CHAR_TALENTS_SCHEMA = {};

const MOB_PERKS_SCHEMA = {
    perks: {},
};

const ROOM_ABILITIES_SCHEMA = {
    abilities: {},
};

export const PRIORITY_TALENTS = PRIORITY_CHAR + PRIORITY_MOBS + PRIORITY_ROOMS + PRIORITY_CONFIG + 10;

export default class TalentsModel extends MasterModel {
    protected controller: TalentsController;
    protected services: TalentsServices;

    init(files, app) {
        this.controller = files.controller;
        this.services = files.services;

        this.schema = TALENT_SCHEMA;
        this.minimize = true;
        this.listenForSchemaAddition("Talent");
    }

    get priority() {
        return PRIORITY_TALENTS;
    }

    createModel() {
        this.setModel("Talent");

        let CharTalentsModel = this.createNewModel("CharTalents", CHAR_TALENTS_SCHEMA, { _id: false, strict: false, minimize: false });
        this.addToSchema("Character", { talents: CharTalentsModel.schema });
        const charTalentsInitialValue = () => ({
            [statsConfig.ABILITY_MELEE]: this.services.getEmptyCharAbility(statsConfig.ABILITY_MELEE),
        });
        this.listenForFieldAddition("Character", "talents", charTalentsInitialValue);

        this.addToSchema("Character", { charTalents: CharTalentsModel.schema });
        this.listenForFieldAddition("Character", "charTalents", () => ({
            [talentsConfig.CHAR_TALENT]: this.services.getEmptyCharAbility(talentsConfig.CHAR_TALENT),
        }));

        this.addToSchema("Mobs", MOB_PERKS_SCHEMA);

        this.addToSchema("Rooms", ROOM_ABILITIES_SCHEMA);

        this.addToSchema("Config", { perks: CONFIG_PERK_SCHEMA });

        this.removeListen("Talent");

        setTimeout(() => this.controller.warmTalentsInfo()); // timeout so the Model can be set
        return Promise.resolve();
    }
}
