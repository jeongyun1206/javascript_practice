const fs = require('fs').promises;
const path = require('path');
const sanitizeHtml = require('sanitize-html');

class Template {
    constructor(parsedUrl, method) {
        this.TemplateConstructor(parsedUrl, method);
    }
    async TemplateConstructor(parsedUrl, method) {
        this.title = sanitizeHtml(this.getTitle(parsedUrl));
        this.list = await this.getList(parsedUrl);
        if (!method) {
            this.control = this.getControl(this.title);
            this.description = await this.getDescription(this.title);
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
                        `

        }
    }
    getTitle(parsedUrl) {
        if (!parsedUrl.query.id)
            return ('welcome');
        else
            return (path.parse(parsedUrl.query.id).base);
    }
    async getForm(method) {
        let titleValue = '', description = '', updateInfo = '';
        if (method === 'update') {
            description = await fs.readFile('Data/' + this.title, 'utf-8');
            titleValue = 'value=' + this.title;
            updateInfo = `<input type="hidden" name="id" value="${this.title}" ></input>`;
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
        const dataList = await fs.readdir('./Data');
        let list = '<ul>';
        for (let dataElement of dataList) {
            list += `<li><a href="/?id=${dataElement}">${dataElement}</a></li>`
        }
        list += '</ul>'
        return (list);
    }
    async getDescription(title) {
        if (title == 'welcome')
            return ('Hello Node.js');
        return (await fs.readFile(__dirname + '/Data/' + title, 'utf-8'));
    }
    getControl(title) {
        if (title === 'welcome')
            return ('<a href="/create">create</a>');
        return (`<a href="/create">create</a> 
        <a href="/update?id=${title}">update</a> 
        <form action="delete_process" method="post"> 
            <input type="hidden" name="id" value="${title}"> 
            <input type="submit" value="delete"> 
        </form>`);
    }
    getTemplate() {
        return (this.template);
    }
};

module.exports = Template;