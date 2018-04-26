
export function getMapOfMap(bigMap: Map<any, Map<any, any>>, key: string, createIfMissing: boolean = false): Map<any, any> {
    return getAnyOfMap(bigMap, key, () => new Map(), createIfMissing);
}

export function getSetOfMap(bigMap: Map<any, Set<any>>, key: string, createIfMissing: boolean = false): Set<any> {
    return getAnyOfMap(bigMap, key, () => new Set(), createIfMissing);
}

export function getAnyOfMap(bigMap: Map<any, any>, key: string, valueCreator: () => any, createIfMissing: boolean = false): any {
    let value = bigMap.get(key);
    if (!value) {
        value = valueCreator();
        if (createIfMissing) {
            bigMap.set(key, value);
        }
    }
    return value;
}