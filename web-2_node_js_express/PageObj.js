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
    async setTopicContent(req) {
        if ((req.route.path === '/page/:pageId' || req.route.path === '/page/update/:pageId') && req.params.pageId)
            return ((await query('SELECT topic.id, title, description, author_id, name, profile FROM topic LEFT JOIN author on topic.author_id=author.id WHERE topic.id=?', [req.params.pageId]))[0]);
    }
    async setAuthorContent(req) {
        if (req.route.path === '/author/update/:authorId' && req.params.authorId)
            return ((await query('SELECT * FROM author WHERE id=?', [req.params.authorId]))[0]);
    }
    async getObj(req) {
        this.obj.allTopics  = await this.setAllTopic();
        this.obj.allAuthors = await this.setAllAuthor();
        this.obj.topicContent   = await this.setTopicContent(req);
        this.obj.authorContent  = await this.setAuthorContent(req);
        return (this.obj);
    }
}

module.exports = PageObj;