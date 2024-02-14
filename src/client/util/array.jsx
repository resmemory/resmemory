


export class ArrayUtil {
    /**
     * @param {number} itemCount
     * @param {() => any} itemBuilder
     */
    static builder(itemCount, itemBuilder) {
        return Array(itemCount).fill(null).map(itemBuilder);
    }
}