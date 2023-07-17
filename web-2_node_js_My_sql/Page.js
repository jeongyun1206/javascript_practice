const sanitizeHtml = require('sanitize-html');

class Page {
    constructor(type, obj) {
        if (type == 'basic' && !obj.content) {
            this.setHomePage(obj);
        } else if (type == 'basic' && obj.content) {
            this.setDescriptionPage(obj);
        } else if (type == 'create') {
            this.setCreatePage(obj);
        } else if (type == 'update') {
            this.setUpdatePage(obj);
        }
    }
    getPage() {
        return (this.page);
    }
    setHomePage(obj) {
        this.page = 
        `<!doctype html>
        <html>
        <head>
        <title>WEB1 - welcome</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${this.getTopicSelector(obj)}
        <a href="/create">create</a> 
        <a href="/author">author</a> 
        <h2>welcome</h2>
        <p>Hello Node.js!</p>
        </body>
        </html>
        `
    }
    setDescriptionPage(obj) {
        this.page = 
        `<!doctype html>
        <html>
        <head>
        <title>WEB1 - ${sanitizeHtml(obj.content.title)}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${this.getTopicSelector(obj)}
        <a href="/create">create</a> 
        <a href="/update?id=${obj.content.id}">update</a> 
        <form action="delete_process" method="post"> 
            <input type="hidden" name="id" value="${obj.content.id}"> 
            <input type="submit" value="delete"> 
        </form>
        <a href="/author">author</a> 
        <h2>${sanitizeHtml(obj.content.title)}</h2>
        <p>
            ${sanitizeHtml(obj.content.description)}
        </p>
        <p>by ${sanitizeHtml(obj.content.name)}</p>
        </body>
        </html>
        `
    }
    setCreatePage(obj) {
        this.page =
        `<!doctype html>
        <html>
        <head>
        <title>WEB1 - create</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${this.getTopicSelector(obj)}
        <p>
        <form action="http://localhost:8080/create_process" method="post">
            <p>
                <input type="text" name="title" placeholder="title">
            </p>
            <p>
                <textarea name="description" placeholder="description" ></textarea>
            </p>
            <p>
                ${this.getAuthorSelector(obj, 'create')}
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
        </p>
        </body>
        </html>
        `
    }
    setUpdatePage(obj) {
        this.page =
        `<!doctype html>
        <html>
        <head>
        <title>WEB1 - ${sanitizeHtml(obj.content.title)}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${this.getTopicSelector(obj)}
        <p>
        <form action="http://localhost:8080/update_process" method="post">
            <input type="hidden" name="id" value="${obj.content.id}" ></input>
            <p>
                <input type="text" name="title" placeholder="title" value="${sanitizeHtml(obj.content.title)}">
            </p>
            <p>
                <textarea name="description" placeholder="description">${obj.content.description}</textarea>
            </p>
            <p>
                ${this.getAuthorSelector(obj, 'update')}
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
        </p>
        </body>
        </html>
        `
    }
    getTopicSelector(obj) {
        let list = '<ul>';
        for (let dataElement of obj.allTopics) {
            list += `<li><a href="/?id=${dataElement.id}">${sanitizeHtml(dataElement.title)}</a></li>`
        }
        list += '</ul>'
        return (list);
    }
    getAuthorSelector(obj, type) {
        let list = '<select name="author">';
        for (const dataElement of obj.allAuthors) {
            if (type === 'update' && dataElement.id == obj.content.author_id)
                list += `<option value=${dataElement.id} selected>${sanitizeHtml(dataElement.name)}</a></option>`
            else
                list += `<option value=${dataElement.id}>${sanitizeHtml(dataElement.name)}</a></option>`
        }
        list += '</select>'
        return (list);
    }
}

module.exports = Page;