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
}

interface Char extends Doc {
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
}

interface CHAR_TALENT_OBJECT {
    markModified: (path) => {}, 
    _doc: {[ability: string]: CHAR_ABILITY_TALENT}
}

interface User extends Doc {
    boss?: boolean // user with extended priviledges
    characters: Char[]
}

interface GameSocket extends SocketIO.Socket {
    test?: boolean;
    character: Char;
    user: User;
    map: Map<string, GameSocket>;
    bitch: boolean;
    alive: boolean,
    lastAttackLoad: number;
    bonusStats?: BASE_STATS_MODEL;
    bonusPerks?: PERK_MAP;
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
    getDmgModifier: (attacker: GameSocket|MOB_INSTANCE, target: GameSocket|MOB_INSTANCE) => DMG_RESULT
    getThreatModifier: () => number
    getDefenceModifier: (attacker: GameSocket|MOB_INSTANCE, target: GameSocket|MOB_INSTANCE) => number
    getHpRegenModifier: () => number
    getMpRegenModifier: () => number
    getHpRegenInterval: () => number
    getMpRegenInterval: () => number
    currentSpell?: ABILITY_SPELL_MODEL
    buffs: Map<string, Set<BUFF_INSTANCE>>
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
    req?: {
        lvl?: number,
    }
    use?: {
        hp?: number
        mp?: number
    }
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
    stack?: number,
}
interface ITEMS_COUNTS extends Map<string, number> {}
interface DROP_MODEL {
    key: string,
    minStack?: number,
    maxStack?: number,
}

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
    abilities?: ROOM_ABILITIES
}
interface ROOM_ABILITIES {
    [key: string]: true
}

// mobs
interface MOB_MODEL {
    mobId: string, // a unique id for this type of mobs
    hp: number,
    lvl: number,
    exp: number,
    minDmg: number,
    maxDmg: number,
    drops: DROP_MODEL[],
    perks?: PERK_MAP,
    spells?: {
        [spellKey: string]: MOB_SPELL
    }
}
interface MOB_SPELL {
    perks: PERK_MAP
    minTime: number
    maxTime: number
}
interface MOB_INSTANCE extends MOB_MODEL {
    id?: string, // a unique id for this specific mob
    x?: number,
    y?: number,
    room?: string,
    dmgers?: Map<string, number>
    threat?: {
        top?: string
        map: Map<string, number>
    }
    dmged?: number
    spawn?: SPAWN_INSTANCE,
    currentSpell?: MOB_SPELL
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
        [room: string]: {
            portal: string
        }
    }
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

interface ABILITY_SPELL_MODEL {
    key: string,
    lvl: number,
    mp: number,
    perks: PERK_MAP
}

interface TALENT_INFO {
    hitType: "atk"|"heal"
    mp?: number
    initPerks?: PERK_MAP
}

interface TALENT_MODEL {
    ability: string,
    perks: ABILITY_PERK_MODEL[],
    spells: ABILITY_SPELL_MODEL[],
    info: TALENT_INFO
}

interface PERK_CONFIG {
	value: number,
    max?: number,
    acc?: number,
	default?: number, 
}

interface CHAR_ABILITY_TALENT {
    lvl: number,
    exp: number,
    points: number, // available points to lvl
    pool: string[], 
    perks: PERK_MAP // the chosen points
}

interface BUFF_INSTANCE {
    clearTimeoutId: NodeJS.Timer,
    perkName: string,
    duration: number,
    initTime: number,
    onPerkCleared?: Function,
}

interface ROOM_STATE extends Map<string, string> {}