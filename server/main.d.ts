/// <reference path="../node_modules/@types/socket.io/index.d.ts" />
/// <reference path="../node_modules/@types/mongoose/index.d.ts" />

interface EVENT {
    name: string;
    throttle?: number;
    bitch?: boolean;
    alive?: boolean;
    log?: boolean;
}

interface Doc {
    _id: any;
    save?(fn?: (err: any, product: this, numAffected: number) => void): Promise<this>;
    toJSON: () => this
}

interface Config extends Doc {
    beginEquips: BeginEquips
    perks: {[key: string]: PERK_CONFIG}
}

interface BeginEquips {
    head?:   string;
    chest?:  string;
    legs?:   string;
    gloves?: string;
    shoes?:  string;
    weapon?:  string;
}

interface Equips {
    head:   ITEM_INSTANCE;
    chest:  ITEM_INSTANCE;
    legs:   ITEM_INSTANCE;
    gloves: ITEM_INSTANCE;
    shoes:  ITEM_INSTANCE;
    weapon:  ITEM_INSTANCE;
}

interface Stats {
    lvl: number,
    exp: number,
    hp: {
        now: number,
        total: number,
    },
    mp: {
        now: number,
        total: number,
    },
    primaryAbility: string,
}
interface FULL_STATS extends Stats {
    maxHp: number
    maxMp: number
}

interface CHAR_ITEMS extends Array<ITEM_INSTANCE> {
    set: (index: number, obj: ITEM_INSTANCE|{}) => {};
}

interface CHAR_POSITION {
    x: number;
    y: number;
    z: number;
    climbing: boolean, 
}

interface PublicChar {
    _id: any
    name: string;
    position: CHAR_POSITION,
    looks,
    equips: Equips,
    stats: FULL_STATS,
}

interface KnownChar {
    _id: any
    name: string;
    stats: FULL_STATS,
    room: string;
}

interface PrivateChar extends PublicChar {
    room: string;
    gold: number;
    items: CHAR_ITEMS,
    quests: CHAR_QUESTS,
    charTalents: CHAR_TALENT_OBJECT
    talents: CHAR_TALENT_OBJECT
    vars: CHAR_VARS
}

interface Char extends Doc {
    markModified?: (path) => {}, 
    name: string;
    position: CHAR_POSITION,
    looks,
    equips: Equips,
    stats: Stats,
    room: string;
    gold: number;
    items: CHAR_ITEMS,
    quests: CHAR_QUESTS,
    charTalents: CHAR_TALENT_OBJECT
    talents: CHAR_TALENT_OBJECT
    vars: CHAR_VARS
}

type CHAR_VAR = any;
interface CHAR_VARS {
    [varName: string]: CHAR_VAR
}

interface CHAR_TALENT_OBJECT {
    markModified: (path) => {}, 
    _doc: {[ability: string]: CHAR_ABILITY_TALENT}
}

interface User extends Doc {
    boss?: boolean // user with extended priviledges
    characters: Char[]
}

interface BONUS_PERKSABLE {
    bonusPerks: PERK_MAP
}
interface PERKABLE {
    perks?: PERK_MAP
}
interface WORLD_HURTER extends PERKABLE {
    id: "world-dmg"
}
type PLAYER = GameSocket|MOB_INSTANCE;
type HURTER = PLAYER|WORLD_HURTER;

interface GameSocket extends SocketIO.Socket {
    test?: boolean;
    character: Char;
    user: User;
    map: Map<string, GameSocket>;
    bitch: boolean;
    alive: boolean,
    lastAttackLoad: number;
    bonusStats: BASE_STATS_MODEL;
    bonusPerks: PERK_MAP;
    throttles: Map<Function, number>;
    maxHp: number;
    maxMp: number;
    threats: Set<MOB_INSTANCE>
    saveTimer: NodeJS.Timer
    hpRegenTimer: NodeJS.Timer
    mpRegenTimer: NodeJS.Timer
    getKnownsList: (() => Iterable<string>)[] // List of getters for knowns
    getTargetsHit: (targetIds: string[]) => string[]
    getLoadModifier: () => number
    getDmgBonus: () => number
    getDmgModifier: (attacker: PLAYER, target: PLAYER) => DMG_RESULT
    getMinDmgModifier: (attacker: PLAYER) => number
    getThreatModifier: () => number
    getDefenceModifier: (attacker: PLAYER, target: PLAYER) => number
    getDefenceBonus: (target: PLAYER) => number
    getHpRegenModifier: () => number
    getMpRegenModifier: () => number
    getHpRegenInterval: () => number
    getMpRegenInterval: () => number
    getMpUsageModifier: () => number
    currentSpell?: ACTIVE_SPELL
    buffs: Map<string, Set<BUFF_INSTANCE>>
    emitter: NodeJS.EventEmitter
}

interface ATTACK_INFO {
    timerId: NodeJS.Timer
    load: number
    ability: string,
    spell_key?: string,
}

interface DMG_RESULT {
    dmg: number
    crit: boolean
}

// items
interface BASE_STATS_MODEL {
    hp?: number,
    mp?: number,
}
interface ITEM_MODEL {
    key: string,
    type: string,
    gold: number,
    chance: number,
    cap?: number,
    stats?: BASE_STATS_MODEL,
    perks?: PERK_MAP,
    req?: {
        lvl?: number,
    }
    use?: {
        hp?: number
        mp?: number
    },
    mobsDrop?: ITEM_MOBS_DROP
}
interface ITEM_MOBS_DROP {
    minLvl?: number,
    maxLvl?: number,
    minStack?: number,
    maxStack?: number,
}
interface ITEM_DROP {
    x: number, 
    y: number, 
    item_id: string, 
    owner?: string
    item: ITEM_INSTANCE
}
interface ITEM_INSTANCE extends BASE_STATS_MODEL {
    key: string,
    perks?: PERK_MAP,
    stack?: number,
}
interface ITEMS_COUNTS extends Map<string, number> {}
interface DROP_MODEL {
    key: string,
    minStack?: number,
    maxStack?: number,
}
type AVAILABLE_SLOTS = false|{[key: string]: number[]};

// rooms
interface PORTAL_MODEL {
    x: number,
    y: number,
    targetRoom: string,
    targetPortal: string,
}
interface SPAWN_MODEL {
    mobId: string,
    cap: number,
    interval: number,
    x: number,
    y: number,
}
interface SPAWN_INSTANCE extends SPAWN_MODEL {
    mobs?: Map<string, MOB_INSTANCE>, // mobs spawned in the spawn
}
interface ROOM_MODEL {
    name: string,
    town: string,
    portals: {
        [key: string]: PORTAL_MODEL
    },
    spawns: SPAWN_MODEL[],
    pvp?: boolean,
    abilities?: ROOM_ABILITIES
}
interface ROOM_ABILITIES {
    [key: string]: true
}

interface SPELL_BASE {
    perks: PERK_MAP
    condBuff?: string[]
    clearBuffs?: string[]
}

// mobs
interface MOB_MODEL {
    mobId: string, // a unique id for this type of mobs
    hp: number,
    lvl: number,
    exp: number,
    dmg: number,
    drops: DROP_MODEL[],
    perks?: PERK_MAP,
    spells?: {
        [spellKey: string]: MOB_SPELL
    },
    deathSpell?: MOB_DEATH_SPELL
    spellMinTime?: number
    spellMaxTime?: number
}
interface MOB_SPELL_BASE extends SPELL_BASE {
    spawn?: string[]
}
interface MOB_SPELL extends MOB_SPELL_BASE {
    chance: number
}
interface MOB_DEATH_SPELL extends MOB_SPELL_BASE {
    key: string,
    duration?: number
}

interface MOB_INSTANCE extends MOB_MODEL {
    id: string, // a unique id for this specific mob
    x: number,
    y: number,
    room: string,
    dmgers: Map<string, number>
    threat: {
        top?: string
        map: Map<string, number>
    }
    dmged: number
    spawn?: SPAWN_INSTANCE,
    currentSpell?: MOB_SPELL_BASE
    bonusPerks: PERK_MAP
}
interface ROOM_MOBS {
    spawns: SPAWN_INSTANCE[],
}

// quests
interface QUEST_MODEL {
    key: string
    cond?: QUEST_CONDITIONS
    req?: QUEST_REQUIREMENTS
    reward?: QUEST_REWARDS
}
interface QUEST_CONDITIONS {
    loot?: {
        [itemKey: string]: number
    }
    hunt?: {
        [mobKey: string]: number
    }
    ok?: {
        [taskKey: string]: number
    }
    dmg?: number
    heal?: number
}
interface REQUIRED_QUEST {
    key: string
    phase: string
}
interface QUEST_REQUIREMENTS {
    lvl?: number 
    quests?: REQUIRED_QUEST[]
}
interface QUEST_REWARDS {
    items?: ITEM_INSTANCE[]
    exp?: number
    stats?: BASE_STATS_MODEL
    ability?: string
}

interface CHAR_QUESTS {
    markModified: (path) => {}
    progress: {
        [questKey: string]: {}
    }
    done: {
        [questKey: string]: {}
    }
    hunt: {
        [mobId: string]: {
            [questKey: string]: number
        }
    }
    ok: {
        [taskKey: string]: {
            [questKey: string]: number
        }
    }
    dmg: {
        [questKey: string]: number
    }
    heal: {
        [questKey: string]: number
    }
}

// Party
interface PARTY_MODEL {
    name: string // party name
    leader: string // leader name
    members: Set<string> // list of member names
    invitees: Map<string, NodeJS.Timer> // invitee name to its clear-timeout id
}

// Npcs
interface NPC_ITEM {
    key: string
}
interface NPC_MODEL {
    key: string,
    room: string,
    givingQuests: string[]
    endingQuests: string[]
    sell?: NPC_ITEM[]
    teleportRooms?: {
        [room: string]: NPC_TELEPORT_ROOM
    }
}
interface NPC_TELEPORT_ROOM {
    portal: string,
    party?: boolean
}

interface ABILITY_PERK_INSTANCE {
    perksOffered: number
    pool: string[]
}

interface ABILITY_PERK_MODEL {
    atLeastLvl: number,
    perksOffered: number,
    addToPool: string[]
}

interface PERK_MAP {
    [perkKey: string]: number
}

interface ABILITY_SPELL_MODEL extends SPELL_BASE {
    key: string,
    lvl: number,
    mp: number,
    cd?: number
}

type POWER_TYPES = "melee"|"range"|"magic";
interface TALENT_INFO {
    powerType: POWER_TYPES
    hitType?: "atk"|"heal"
    mp?: number
    initPerks?: PERK_MAP
}

interface TALENT_MODEL {
    ability: string,
    perks: ABILITY_PERK_MODEL[],
    spells: ABILITY_SPELL_MODEL[],
    info: TALENT_INFO
}

type PERK_TYPE_PERCENT = "Percent";
type PERK_TYPE_TIME = "Time";
type PERK_TYPE_NUMBER = "Number";

type PERK_TYPES = PERK_TYPE_PERCENT | PERK_TYPE_TIME | PERK_TYPE_NUMBER;

interface PERK_CONFIG {
    value: number,
    type: PERK_TYPES
    max?: number,
    acc?: number,
	default?: number, 
    bonusPerks?: PERK_MAP, 
    client?: true
}

interface CHAR_ABILITY_TALENT {
    lvl: number,
    exp: number,
    points: number, // available points to lvl
    pool: string[], 
    perks: PERK_MAP // the chosen points
    spells?: CHAR_TALENT_SPELLS
}
interface CHAR_TALENT_SPELLS {
    [key: string]: CHAR_TALENT_SPELL
}
interface CHAR_TALENT_SPELL {
    lvl: number
    exp: number
    bonusPerks: PERK_MAP
}
interface ACTIVE_SPELL extends ABILITY_SPELL_MODEL {
    // perks are modified here and are not the original
}

interface PERKS_DIFF {
    hpBonus?: number,
    mpBonus?: number,
}

interface BUFF_INSTANCE {
    clearTimeoutId: NodeJS.Timer,
    perkName: string,
    duration: number,
    initTime: number,
    onPerkCleared?: Function,
}

interface ROOM_STATE extends Map<string, string> {}

// Dungeons
// ========
interface DUNGEON_REWARD {
    key: string,
    chance: number,
    stack: number,
}
interface DUNGEON_STAGE {
    rooms: string[],
    rareRooms: string[],
    rewards: DUNGEON_REWARD[],
}
interface DUNGEON {
    key: string,
    minLvl: number,
    maxLvl: number,
    time: number,
    beginRoom: string,
    stages: DUNGEON_STAGE[],
    perksPool: PERK_MAP[],
    rareBonuses: string[],
}
interface RUNNING_DUNGEON {
    startTime: number,
    timerId: NodeJS.Timer,
    dungeon: DUNGEON,
    currentStageIndex: number,
}