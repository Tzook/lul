
import MasterMiddleware from '../master/master.middleware';

export default class RoomsMiddleware extends MasterMiddleware {
    public getPublicCharInfo(socket: GameSocket): PublicChar {
        let {name, position, equips, stats, looks, _id} = socket.character.toJSON();
        let fullStats = extendStatsWithMax(stats, socket);
        return {name, position, equips, stats: fullStats, looks, _id};
    }
    public getPrivateCharInfo(socket: GameSocket): PrivateChar {
        // some properties should not be sent even when private
        let {save, toJSON, stats, markModified, ...otherCharProperties} = socket.character.toJSON();
        let fullStats = extendStatsWithMax(stats, socket);
        return {stats: fullStats, ...otherCharProperties};
    }
};

export function extendStatsWithMax(stats: Stats, socket: GameSocket): FULL_STATS {
    return Object.assign({
        maxHp: socket.maxHp,
        maxMp: socket.maxMp,
    }, stats);
}