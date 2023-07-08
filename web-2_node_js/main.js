const http =require('http');
const fs = require('fs').promises;
const url = require('url');
const qs = require('querystring');
const Template = require('./template.js');
const path = require('path');

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
            req.on('end',  () => {
                const post = qs.parse(body);
                if (parsedUrl.pathname === '/update_process') {
                    const filteredId = path.parse(post.id).base;
                    const filteredTitle = path.parse(post.title).base;
                    fs.rename(`Data/${filteredId}`, `Data/${filteredTitle}`);
                    fs.writeFile('Data/' + filteredTitle, post.description, 'utf-8', (err) => { console.error(err); });
                    res.writeHead(302, {Location: `/?id=${filteredTitle}`});
                }
                else if (parsedUrl.pathname === '/create_process') {
                    const filteredTitle = path.parse(post.title).base;
                    fs.writeFile('Data/' + filteredTitle, post.description, 'utf-8', (err) => { console.error(err); });
                    res.writeHead(302, {Location: `/?id=${filteredTitle}`});
                }
                else if (parsedUrl.pathname === '/delete_process') {
                    const filteredId = path.parse(post.id).base;
                    fs.unlink(`Data/${filteredId}`);
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