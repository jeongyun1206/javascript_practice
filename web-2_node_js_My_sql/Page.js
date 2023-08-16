const sanitizeHtml = require('sanitize-html');

class Page {
    constructor(type, obj) {
        if (type == 'basic' && !obj.topicContent) {
            this.setHomePage(obj);
        } else if (type == 'basic' && obj.topicContent) {
            this.setDescriptionPage(obj);
        } else if (type == 'create') {
            this.setCreatePage(obj);
        } else if (type == 'update') {
            this.setUpdatePage(obj);
        } else if (type == 'author') {
            this.setAuthorPage(obj);
        } else if (type == 'author_update') {
            this.setAuthorUpdatePage(obj);
        } else if (type == 'author_create') {
            this.setAuthorCreatePage(obj);
        }
    }
    getPage() {
        return (this.page);
    }
    setAuthorPage(obj) {
        this.page = 
        `<!doctype html>
        <html>
        <head>
        <title>WEB1 - author</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${this.getTopicSelector(obj)}
        <h2>Author List</h2>
        <a href="/author_create">create</a>
        ${this.getAuthorTable(obj)}
        </body>
        </html>
        ` 
    }
    setAuthorUpdatePage(obj) {
        this.page = 
        `<!doctype html>
        <html>
        <head>
        <title>WEB1 - author</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${this.getTopicSelector(obj)}
        <h2>Author List</h2>
        ${this.getAuthorTable(obj)}
        <p>
        <form action="http://localhost:8080/author_update_process" method="post">
            <input type="hidden" name="id" value="${obj.authorContent.id}" ></input>
            <p>
                <input type="text" name="name" placeholder="name" value="${sanitizeHtml(obj.authorContent.name)}">
            </p>
            <p>
                <textarea name="profile" placeholder="profile">${sanitizeHtml(obj.authorContent.profile)}</textarea>
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
    setAuthorCreatePage(obj) {
        this.page = 
        `<!doctype html>
        <html>
        <head>
        <title>WEB1 - author</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${this.getTopicSelector(obj)}
        <h2>Author List</h2>
        ${this.getAuthorTable(obj)}
        <form action="http://localhost:8080/author_create_process" method="post">
            <p>
                <input type="text" name="name" placeholder="name">
            </p>
            <p>
                <textarea name=profile placeholder="profile"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
        </body>
        </html>
        ` 

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
        <title>WEB1 - ${sanitizeHtml(obj.topicContent.title)}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${this.getTopicSelector(obj)}
        <a href="/create">create</a> 
        <a href="/update?id=${obj.topicContent.id}">update</a> 
        <form action="delete_process" method="post"> 
            <input type="hidden" name="id" value="${obj.topicContent.id}"> 
            <input type="submit" value="delete"> 
        </form>
        <a href="/author">author</a> 
        <h2>${sanitizeHtml(obj.topicContent.title)}</h2>
        <p>
            ${sanitizeHtml(obj.topicContent.description)}
        </p>
        <p>by ${sanitizeHtml(obj.topicContent.name)}</p>
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
        <title>WEB1 - ${sanitizeHtml(obj.topicContent.title)}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${this.getTopicSelector(obj)}
        <p>
        <form action="http://localhost:8080/update_process" method="post">
            <input type="hidden" name="id" value="${obj.topicContent.id}" ></input>
            <p>
                <input type="text" name="title" placeholder="title" value="${sanitizeHtml(obj.topicContent.title)}">
            </p>
            <p>
                <textarea name="description" placeholder="description">${sanitizeHtml(obj.topicContent.description)}</textarea>
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
            if (type === 'update' && dataElement.id == obj.topicContent.author_id)
                list += `<option value=${dataElement.id} selected>${sanitizeHtml(dataElement.name)}</a></option>`
            else
                list += `<option value=${dataElement.id}>${sanitizeHtml(dataElement.name)}</a></option>`
        }
        list += '</select>'
        return (list);
    }
    getAuthorTable(obj) {
        let table = 
        `<table border="1">
        <th>name</th>
        <th>profile</th>
        <th>update</th>
        <th>delete</th>`;
        for (let author of obj.allAuthors) {
            table += `<tr>`
            table += `<td>${sanitizeHtml(author.name)}</td>`;
            table += `<td>${sanitizeHtml(author.profile)}</td>`;
            table += `<td><a href="/author_update?id=${author.id}">update</a></td>`;
            table += `<td>
            <form action="author_delete_process" method="post"> 
            <input type="hidden" name="id" value="${author.id}"> 
            <input type="submit" value="delete"> 
            </form> 
            </td></tr>`;
        }
        table += '</table>';
        return (table);
    }
}

module.exports = Page;