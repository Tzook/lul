/// <reference path="node_modules/@types/socket.io/index.d.ts" />
/// <reference path="node_modules/@types/mongoose/index.d.ts" />

interface Doc {
    _id: any;
    save(fn?: (err: any, product: this, numAffected: number) => void): Promise<this>;
}

interface Item extends Doc {
    name: string;
    icon: string;
    type: string;
}

interface Equips {
    head:   Item;
    chest:  Item;
    legs:   Item;
    gloves: Item;
    shoes:  Item;
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

interface ItemsArray extends Array<Item> {
    set: (index: number, obj: Item|{}) => {};
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
    items: ItemsArray,
    equips: Equips,
    stats: Stats,
}

interface User extends Doc {

}

interface GameSocket extends SocketIO.Socket {
    id: string;
    character: Char;
    user: User;
    map: Map<string, GameSocket>;
    bitch: boolean;
    lastAttackLoad: number;
}

// rooms
interface PORTAL_SCHEMA {
    x: number,
    y: number,
}
interface SPAWN_SCHEMA {
    mobId: string,
    cap: number,
    interval: number,
    x: number,
    y: number,
}
interface SPAWN_INSTANCE extends SPAWN_SCHEMA {
    mobs?: Map<string, MOB_INSTANCE>, // mobs spawned in the spawn
}

interface ROOM_SCHEMA {
    name: string,
    portals: {
        [targetPortal: string]: PORTAL_SCHEMA
    },
    spawns: SPAWN_SCHEMA[],
}

// mobs
interface MOB_SCHEMA {
    mobId: string, // a unique id for this type of mobs
    name: string, // the display name of the mob
    hp: number,
    lvl: number,
    exp: number,
    minDmg: number,
    maxDmg: number,
}

interface MOB_INSTANCE extends MOB_SCHEMA {
    id?: string, // a unique id for this specific mob
    x?: number,
    y?: number,
    spawn?: SPAWN_INSTANCE,
}

interface ROOM_MOBS {
    spawns: SPAWN_INSTANCE[],
}