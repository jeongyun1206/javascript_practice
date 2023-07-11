const path = require('path');
const sanitizeHtml = require('sanitize-html');
const {db, query} = require('./mysql.js');

class Template {
    constructor(parsedUrl, method) {
        this.TemplateConstructor(parsedUrl, method);
    }
    async TemplateConstructor(parsedUrl, method) {
        this.id = sanitizeHtml(this.getId(parsedUrl));
        this.title = await this.getTitle();
        this.list = await this.getList();
        if (!method) {
            this.control = this.getControl();
            this.description = await this.getDescription();
            this.template = `
                        <!doctype html>
                        <html>
                        <head>
                        <title>WEB1 - ${this.title}</title>
                        <meta charset="utf-8">
                        </head>
                        <body>
                        <h1><a href="/">WEB</a></h1>
                        ${this.list}
                        ${this.control}
                        <h2>${this.title}</h2>
                        <p>
                            ${sanitizeHtml(this.description)}
                        </p>
                        </body>
                        </html>
                        `
        } else {
            this.form = await this.getForm(method);
            this.template = `
                        <!doctype html>
                        <html>
                        <head>
                        <title>WEB1 - ${this.title}</title>
                        <meta charset="utf-8">
                        </head>
                        <body>
                        <h1><a href="/">WEB</a></h1>
                        ${this.list}
                        <p>${this.form}</p>
                        </body>
                        </html>
                        `;
        }
    }
    async getTitle() {
        if (this.id == 0)
            return ('welcome');
        return ((await query(`SELECT title FROM topic WHERE id=${this.id}`))[0].title);
    }
    getId(parsedUrl) {
        if (!parsedUrl.query.id)
            return (0);
        else
            return (path.parse(parsedUrl.query.id).base);
    }
    async getForm(method) {
        let titleValue = '', description = '', updateInfo = '';
        if (method === 'update') {
            description = await this.getDescription();
            titleValue = 'value=' + this.title;
            updateInfo = `<input type="hidden" name="id" value="${this.id}" ></input>`;
        }
        const form = 
        `<form action="http://localhost:8080/${method}_process" method="post">
            ${updateInfo}
            <p>
                <input type="text" name="title" placeholder="title" ${titleValue}>
            </p>
            <p>
                <textarea name="description" placeholder="description" >${description}</textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>`
        return (form);
    }
    async getList() {
        const dataList = await query('SELECT * FROM topic');
        let list = '<ul>';
        for (let dataElement of dataList) {
            list += `<li><a href="/?id=${dataElement.id}">${dataElement.title}</a></li>`
        }
        list += '</ul>'
        return (list);
    }
    async getDescription() {
        if (this.id == 0)
            return ('Hello Node.js');
        return ((await query(`SELECT description FROM topic WHERE id=?`, [this.id]))[0].description);
    }
    getControl() {
        if (this.id == 0)
            return ('<a href="/create">create</a>');
        return (`<a href="/create">create</a> 
        <a href="/update?id=${this.id}">update</a> 
        <form action="delete_process" method="post"> 
            <input type="hidden" name="id" value="${this.id}"> 
            <input type="submit" value="delete"> 
        </form>`);
    }
    getTemplate() {
        return (this.template);
    }
};

module.exports = Template;