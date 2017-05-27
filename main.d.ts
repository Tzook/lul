/// <reference path="node_modules/@types/socket.io/index.d.ts" />
/// <reference path="node_modules/@types/mongoose/index.d.ts" />

interface EVENT {
    name: string;
    throttle?: number;
    bitch?: boolean;
    alive?: boolean;
}

interface Doc {
    _id: any;
    save(fn?: (err: any, product: this, numAffected: number) => void): Promise<this>;
}

interface Equips {
    head:   ITEM_INSTANCE;
    chest:  ITEM_INSTANCE;
    legs:   ITEM_INSTANCE;
    gloves: ITEM_INSTANCE;
    shoes:  ITEM_INSTANCE;
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
    abilities: string[],
    primaryAbility: string,
}

interface CHAR_ITEMS extends Array<ITEM_INSTANCE> {
    set: (index: number, obj: ITEM_INSTANCE|{}) => {};
}

interface Char extends Doc {
    room: string;
    name: string;
    position: {
        x: number;
        y: number;
        z: number;
        climbing: boolean, 
    },
    gold: number;
    items: CHAR_ITEMS,
    equips: Equips,
    stats: Stats,
    quests: CHAR_QUESTS
}

interface User extends Doc {}

interface GameSocket extends SocketIO.Socket {
    test?: boolean;
    id: string;
    character: Char;
    user: User;
    map: Map<string, GameSocket>;
    bitch: boolean;
    alive: boolean,
    lastAttackLoad: number;
    bonusStats?: ITEM_STATS_MODEL;
    throttles: Map<Function, number>;
}

// items
interface ITEM_STATS_MODEL {
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
    stats?: ITEM_STATS_MODEL,
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
    item: ITEM_INSTANCE
}
interface ITEM_INSTANCE extends ITEM_STATS_MODEL {
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
        [key: string]: number
    }
    hunt?: {
        [key: string]: number
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