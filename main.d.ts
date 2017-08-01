/// <reference path="node_modules/@types/socket.io/index.d.ts" />
/// <reference path="node_modules/@types/mongoose/index.d.ts" />

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
}

interface Config extends Doc {
    beginEquips: BeginEquips
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
    str: number,
    mag: number,
    dex: number,
    lvl: number,
    exp: number,
    hp: {
        now: number,
        total: number,
        regen: number,
    },
    mp: {
        now: number,
        total: number,
        regen: number,
    },
    class: string,
    abilities: string[],
    primaryAbility: string,
}

interface CHAR_ITEMS extends Array<ITEM_INSTANCE> {
    set: (index: number, obj: ITEM_INSTANCE|{}) => {};
}

interface PublicChar extends Doc {
    name: string;
    position: {
        x: number;
        y: number;
        z: number;
        climbing: boolean, 
    },
    looks,
    equips: Equips,
    stats: Stats,
}

interface KnownChar extends Doc {
    name: string;
    stats: Stats,
    room: string;
}

interface Char extends PublicChar {
    room: string;
    gold: number;
    items: CHAR_ITEMS,
    quests: CHAR_QUESTS
}

interface User extends Doc {}

interface GameSocket extends SocketIO.Socket {
    test?: boolean;
    character: Char;
    user: User;
    map: Map<string, GameSocket>;
    bitch: boolean;
    alive: boolean,
    lastAttackLoad: number;
    bonusStats?: BASE_STATS_MODEL;
    throttles: Map<Function, number>;
    maxHp: number;
    maxMp: number;
    threats: Set<MOB_INSTANCE>
    saveTimer: NodeJS.Timer
    hpRegenTimer: NodeJS.Timer
    mpRegenTimer: NodeJS.Timer
    getKnownsList: (() => Iterable<string>)[] // List of getters for knowns
}

// items
interface BASE_STATS_MODEL {
    str?: number,
    mag?: number,
    dex?: number,
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
        str?: number,
        mag?: number,
        dex?: number,
        lvl?: number,
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
}
interface MOB_INSTANCE extends MOB_MODEL {
    id?: string, // a unique id for this specific mob
    x?: number,
    y?: number,
    dmgers?: Map<string, number>
    threat?: {
        top?: string
        map: Map<string, number>
    }
    dmged?: number
    spawn?: SPAWN_INSTANCE,
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
}
interface QUEST_REQUIREMENTS {
    class?: string
    lvl?: number 
    quests?: string[]
}
interface QUEST_REWARDS {
    items?: ITEM_INSTANCE[]
    class?: string
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
}

// Party
interface PARTY_MODEL {
    name: string // party name
    leader: string // leader name
    members: Set<string> // list of member names
    invitees: Map<string, NodeJS.Timer> // invitee name to its clear-timeout id
}

// Npcs
interface NPC_MODEL {
    key: string,
    room: string,
}