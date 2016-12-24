/// <reference path="node_modules/@types/socket.io/index.d.ts" />
/// <reference path="node_modules/@types/mongoose/index.d.ts" />

interface Doc {
    _id: any;
    save(fn?: (err: any, product: this, numAffected: number) => void): Promise<this>;
}


interface Item extends Doc {
    name: string;
    icon: string;
}

interface ItemsArray extends Array<Item|{}> {
    set: (index: number, obj: Item|{}) => {};
}

interface Char extends Doc {
    room: string;
    position: {
        x: number;
        y: number;
    },
    items: ItemsArray
}

interface User extends Doc {

}

interface GameSocket extends SocketIO.Socket {
    id: string;
    character: Char;
    user: User;
    map: Map<string, GameSocket>;
}