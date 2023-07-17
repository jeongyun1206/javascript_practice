const path = require('path');
const {db, query} = require('./mysql.js');

class PageObj {
    constructor () {
        this.obj = {};
    }
    async setAllTopic() {
        return (await query('SELECT * FROM topic'));
    }    
    async setAllAuthor() {
        return (await query('SELECT * FROM author'));
    }
    async setContent(parsedUrl) {
        if (parsedUrl.query.id)
            return ((await query('SELECT topic.id, title, description, author_id, name, profile FROM topic LEFT JOIN author on topic.author_id=author.id WHERE topic.id=?', [parsedUrl.query.id]))[0]);
    }
    async setObj(parsedUrl) {
        this.obj.allTopics  = await this.setAllTopic();
        this.obj.allAuthors = await this.setAllAuthor();
        this.obj.content    = await this.setContent(parsedUrl);
    }
    getObj() {
        return (this.obj);
    }
}

module.exports = PageObj;