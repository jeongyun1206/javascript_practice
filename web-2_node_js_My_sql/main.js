const http =require('http');
const url = require('url');
const qs = require('querystring');
const path = require('path');
const Page = require('./Page.js');
const PageObj = require('./PageObj.js');
const {db, query} = require('./mysql.js');

const responsePage = async function (req, res, type, parsedUrl) {
    if (type == '404') {
        res.writeHead(404);
        res.end('Not Found');
    }
    const pageObj = new PageObj();
    await pageObj.setObj(parsedUrl);
    const page = new Page(type, pageObj.getObj());
    res.writeHead(200);
    res.end(page.getPage());
}
const process = async function (req, res, type) {
    let body = '';
    req.on('data', (data) => { body += data; });
    req.on('end',  async () => {
        const post = qs.parse(body);
        if (type === 'update') {
            const filteredId = path.parse(post.id).base;
            const filteredTitle = path.parse(post.title).base;
            await query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [filteredTitle, post.description, post.author, filteredId]);
            res.writeHead(302, {Location: `/?id=${filteredId}`});
        }
        else if (type === 'create') {
            const filteredTitle = path.parse(post.title).base;
            const queryResult = await query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`, [filteredTitle, post.description, post.author]);
            res.writeHead(302, {Location: `/?id=${queryResult.insertId}`});
        }
        else if (type === 'delete') {
            const filteredId = path.parse(post.id).base;
            await query('DELETE FROM topic WHERE id=?', [filteredId]);
            res.writeHead(302, {Location: `/`});
        }
        res.end();
    })
}

const server = http.createServer(async function (req, res) {
    try {
        const parsedUrl = url.parse(req.url, true);
        if (parsedUrl.pathname === '/') {
            responsePage(req, res, 'basic', parsedUrl);
        } else if (parsedUrl.pathname === '/create') {
            responsePage(req, res, 'create', parsedUrl);
        } else if (parsedUrl.pathname === '/update') {
            responsePage(req, res, 'update', parsedUrl);
        } else if (parsedUrl.pathname === '/create_process') {
            process(req, res, 'create', parsedUrl);
        } else if (parsedUrl.pathname === '/update_process') {
            process(req, res, 'update', parsedUrl);
        } else if (parsedUrl.pathname === '/delete_process') {
            process(req, res, 'delete', parsedUrl);
        } else {
            responsePage(req, res, '404', parsedUrl);
        }
    } catch(err) {
        console.error(err);
        res.writeHead(404);
        res.end('Not found');
    }
});

server.listen(8080);