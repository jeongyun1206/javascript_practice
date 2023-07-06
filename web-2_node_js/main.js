const http =require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');
const { parse } = require('path');

const getTitle = function(parsedUrl) {
    if (!parsedUrl.query.id)
        return ('welcome');
    else
        return (parsedUrl.query.id);
}

const getDescription = async function(title) {
    if (title == 'welcome')
        return ('Hello Node.js');
    return (await fs.readFile(__dirname + '/Data/' + title, 'utf-8'));
}

const getList = async function() {
    const dataList = await fs.readdir('./Data');
    let list = '<ul>';
    for (dataElement of dataList) {
        list += `<li><a href="/?id=${dataElement}">${dataElement}</a></li>`
    }
    list += '</ul>'
    return (list);
}

const getControl = function(title) {
    if (title === 'welcome')
        return ('<a href="/create">create</a>');
    return (`<a href="/create">create</a> 
    <a href="/update?id=${title}">update</a> 
    <form action="delete_process" method="post"> 
        <input type="hidden" name="id" value="${title}"> 
        <input type="submit" value="delete"> 
    </form>`);
}

const getBasicTemplate = async function(parsedUrl) {
    const title = getTitle(parsedUrl);
    const description = await getDescription(title);
    const control = getControl(title);
    const list = await getList();
    const template = `
                    <!doctype html>
                    <html>
                    <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                    </head>
                    <body>
                    <h1><a href="/">WEB</a></h1>
                    ${list}
                    ${control}
                    <h2>${title}</h2>
                    <p>
                        ${description}
                    </p>
                    </body>
                    </html>
                    `
    return (template);
}

const getForm = async function (title, type) {
    let titleValue = '', description = '', updateInfo = '';
    if (type === 'update') {
        description = await fs.readFile('Data/' + title, 'utf-8');
        titleValue = 'value=' + title;
        updateInfo = `<input type="hidden" name="id" value="${title}" ></input>`;
    }
    const form = 
    `<form action="http://localhost:8080/${type}_process" method="post">
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

const getFormTemplate = async function(parsedUrl, type) {
    const title = getTitle(parsedUrl);
    const form = await getForm(title, type);
    const list = await getList();
    const template = `
                    <!doctype html>
                    <html>
                    <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                    </head>
                    <body>
                    <h1><a href="/">WEB</a></h1>
                    ${list}
                    <p>${form}</p>
                    </body>
                    </html>
                    `
    return (template);
}

const server = http.createServer(async function (req, res) {
    try {
        let parsedUrl = url.parse(req.url, true);
        if (parsedUrl.pathname === '/') {
            const basicTemplate = await getBasicTemplate(parsedUrl);
            res.writeHead(200);
            res.end(basicTemplate);
        } else if (parsedUrl.pathname === '/create'){
            const formTemplate = await getFormTemplate(parsedUrl, 'create');
            res.writeHead(200);
            res.end(formTemplate);
        } else if (parsedUrl.pathname === '/update') {
            const formTemplate = await getFormTemplate(parsedUrl, 'update');
            res.writeHead(200);
            res.end(formTemplate);
        } else if (['/create_process', '/update_process', '/delete_process'].includes(parsedUrl.pathname)) {
            let body = '';
            req.on('data', (data) => {
                body += data;
            });
            req.on('end',  () => {
                const post = qs.parse(body);
                console.log(post);
                if (parsedUrl.pathname === '/update_process') {
                    fs.rename(`Data/${post.id}`, `Data/${post.title}`);
                    fs.writeFile('Data/' + post.title, post.description, 'utf-8', (err) => { console.error(err); });
                    res.writeHead(302, {Location: `/?id=${post.title}`});
                }
                else if (parsedUrl.pathname === '/create_process') {
                    fs.writeFile('Data/' + post.title, post.description, 'utf-8', (err) => { console.error(err); });
                    res.writeHead(302, {Location: `/?id=${post.title}`});
                }
                else if (parsedUrl.pathname === '/delete_process') {
                    fs.unlink(`Data/${post.id}`);
                    res.writeHead(302, {Location: `/`});
                }
                res.end();
            })
        } else {
            res.writeHead(404);
            res.end('Not found');
        }
    } catch (err) {
        console.log(err);
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(8080);