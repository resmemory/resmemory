
export class NumberUtil {
    /**
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    static random(min = 0, max = 1) {
        const range = max - min;
        return Math.floor(Math.random() * range + min);
    }
}