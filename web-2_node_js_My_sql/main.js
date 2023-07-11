const http =require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');
const Template = require('./template.js');
const path = require('path');
const {db, query} = require('./mysql.js');

const server = http.createServer(async function (req, res) {
    try {
        let parsedUrl = url.parse(req.url, true);
        if (parsedUrl.pathname === '/') {
            const template = new Template(parsedUrl);
            await template.TemplateConstructor(parsedUrl);
            res.writeHead(200);
            res.end(template.getTemplate());
        } else if (parsedUrl.pathname === '/create'){
            const template = new Template(parsedUrl, 'create');
            await template.TemplateConstructor(parsedUrl, 'create');
            res.writeHead(200);
            res.end(template.getTemplate());
        } else if (parsedUrl.pathname === '/update') {
            const template = new Template(parsedUrl, 'update');
            await template.TemplateConstructor(parsedUrl, 'update');
            res.writeHead(200);
            res.end(template.getTemplate());
        } else if (['/create_process', '/update_process', '/delete_process'].includes(parsedUrl.pathname)) {
            let body = '';
            req.on('data', (data) => {
                body += data;
            });
            req.on('end',  async () => {
                const post = qs.parse(body);
                if (parsedUrl.pathname === '/update_process') {
                    const filteredId = path.parse(post.id).base;
                    const filteredTitle = path.parse(post.title).base;
                    await query('UPDATE topic SET title=?, description=? WHERE id=?', [filteredTitle, post.description, filteredId]);
                    res.writeHead(302, {Location: `/?id=${filteredId}`});
                }
                else if (parsedUrl.pathname === '/create_process') {
                    const filteredTitle = path.parse(post.title).base;
                    const queryResult = await query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`
                                                    , [filteredTitle, post.description,, 0]);
                    res.writeHead(302, {Location: `/?id=${queryResult.insertId}`});
                }
                else if (parsedUrl.pathname === '/delete_process') {
                    const filteredId = path.parse(post.id).base;
                    query('DELETE FROM topic WHERE id=?', [filteredId]);
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