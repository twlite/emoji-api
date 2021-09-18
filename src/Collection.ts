export default class Collection<K, V> extends Map<K, V> {
    find(fn: (data?: V, key?: K) => boolean): V | undefined {
        let found;

        for (const item of this.entries()) {
            found = fn(item[1], item[0]);
            if (found) return item[1];
        }
    }

    findOne(arg: string) {
        return this.find((data: any) =>  Object.values(data).includes(arg));
    }
}