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
    async setTopicContent(parsedUrl) {
        if ((parsedUrl.pathname === '/' || parsedUrl.pathname === '/update') && parsedUrl.query.id)
            return ((await query('SELECT topic.id, title, description, author_id, name, profile FROM topic LEFT JOIN author on topic.author_id=author.id WHERE topic.id=?', [parsedUrl.query.id]))[0]);
    }
    async setAuthorContent(parsedUrl) {
        if (parsedUrl.pathname === '/author_update' && parsedUrl.query.id)
            return ((await query('SELECT * FROM author WHERE id=?', [parsedUrl.query.id]))[0]);
    }
    async setObj(parsedUrl) {
        this.obj.allTopics  = await this.setAllTopic();
        this.obj.allAuthors = await this.setAllAuthor();
        this.obj.topicContent    = await this.setTopicContent(parsedUrl);
        this.obj.authorContent  = await this.setAuthorContent(parsedUrl);
    }
    getObj() {
        return (this.obj);
    }
}

module.exports = PageObj;