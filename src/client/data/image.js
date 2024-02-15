


export class Image {
    /**
     * @param {number} width 
     * @param {number} height 
     * @param {stirng} url 
     */
    constructor(width, height, url) {
        this.width = width;
        this.height = height;
        this.url = url;
    }

    /**
     * @param {{width: number, height: number, url: string}} object
     * @returns {Image}
     */
    static parse(object) {
        if (object == null) return null;

        return new Image(
            object["width"],
            object["height"],
            object["url"]
        )
    }
}