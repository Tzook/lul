import * as _ from 'underscore';

export function pickRandomIndex(list: any[]): number {
    return _.random(list.length - 1);
}

export function pickRandomIndexes(list: any[], count: number): number[] {
    if (count > list.length) {
        throw new Error(`pickRandomIndexes had count bigger than the list! list: [${list.join(",")}], count: ${count}`);
    }
    const result = new Set();
    let itemsNeeded = count;
    while (itemsNeeded > 0) {
        const randomIndex = pickRandomIndex(list);
        if (!result.has(randomIndex)) {
            result.add(randomIndex);
            itemsNeeded--;
        }
    }
    return Array.from(result);
}