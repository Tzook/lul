export function joinObjects(...objects: {}[]): {} {
    let result = {};
    for (let object of objects) {
        for (let key in (object || {})) {
            let value = object[key];
            result[key] = result[key] || 0;
            result[key] += value;
        }
    }
    return result;
}