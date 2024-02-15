import { Image } from "./image";

export class Post {
    constructor(
        postId,
        userId,
        title,
        content,
        img,
        thumbnail,
        viewCount,
        category,
        createdAt,
        deletedAt,
        nickname,
        bookMarks,
    ) {
        /** @type {number} */ this.postId    = postId;
        /** @type {number} */ this.userId    = userId;
        /** @type {string} */ this.title     = title;
        /** @type {string} */ this.content   = content;
        /** @type {Image}  */ this.img       = img;
        /** @type {Image}  */ this.thumbnail = thumbnail;
        /** @type {number} */ this.viewCount = viewCount;
        /** @type {string} */ this.category  = category;
        /** @type {string} */ this.createdAt = createdAt;
        /** @type {string} */ this.deletedAt = deletedAt;
        /** @type {string} */ this.nickname  = nickname;
        /** @type {number} */ this.bookMarks = bookMarks;
    }

    /**
     * @param {Object} object 
     * @returns {Post}
     */
    static parse(object) {
        return new Post(
            object["postId"],
            object["userId"],
            object["title"],
            object["content"],
            Image.parse(object["img"]),
            Image.parse(object["thumbnail"]),
            object["viewCount"],
            object["category"],
            object["createdAt"],
            object["deletedAt"],
            object["nickname"],
            object["bookmarks"],
        );
    }

    /**
     * @param {Object[]} objects
     * @returns {Post[]}
    */
    static parseByList(objects) {
        return objects.map(object => this.parse(object));
    }
}