const http =require('http');
const url = require('url');
const qs = require('querystring');
const path = require('path');
const Page = require('./Page.js');
const PageObj = require('./PageObj.js');
const {db, query} = require('./mysql.js');
const cookie = require('cookie');

const responsePage = async function (req, res, type, parsedUrl) {
    if (type == '404') {
        res.writeHead(404);
        res.end('Not Found');
    }
    const pageObj = new PageObj();
    await pageObj.setObj(parsedUrl);
    const page = new Page(type, auth(req, res), pageObj.getObj());
    res.writeHead(200);
    res.end(page.getPage());
}

const process = async function (req, res, type) {
    if (!auth(req, res) && type !== 'login') {
        res.end(`login required`);
        return ;
    }
    let body = '';
    req.on('data', (data) => { body += data; });
    req.on('end',  async () => {
        const post = qs.parse(body);
        if (type === 'update') {
            const filteredId = path.parse(post.id).base;
            const filteredTitle = path.parse(post.title).base;
            await query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [filteredTitle, post.description, post.author, filteredId]);
            res.writeHead(302, {Location: `/?id=${filteredId}`});
        } else if (type === 'create') {
            const filteredTitle = path.parse(post.title).base;
            const queryResult = await query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`, [filteredTitle, post.description, post.author]);
            res.writeHead(302, {Location: `/?id=${queryResult.insertId}`});
        } else if (type === 'delete') {
            const filteredId = path.parse(post.id).base;
            await query('DELETE FROM topic WHERE id=?', [filteredId]);
            res.writeHead(302, {Location: `/`});
        } else if (type === 'author_update') {
            const filteredId = path.parse(post.id).base;
            await query('UPDATE author SET name=?, profile=? WHERE id=?', [post.name, post.profile, filteredId]);
            res.writeHead(302, {Location: `/author`});
        } else if (type === 'author_create') {
            await query(`INSERT INTO author (name, profile) VALUES(?, ?)`, [post.name, post.profile]);
            res.writeHead(302, {Location: `/author`});
        } else if (type === 'author_delete') {
            await query('DELETE FROM author WHERE id=?', [post.id]);
            res.writeHead(302, {Location: `/author`});
        } else if (type === 'login') {
            if (post.id === 'jnho' && post.password == '0000') {
                res.writeHead(302, {
                    'Set-Cookie' : [
                       `id=${post.id}`,
                       `password=${post.password}`,
                    ],
                    location: '/',
                })
            } else {
                res.writeHead(302, { location:'/login' });
            }
        } else if (type === 'logout') {
            res.writeHead(302, {
                'Set-Cookie' : [
                   `id=; Max-Age=0`,
                   `password=; Max-Age=0`,
                ],
                location: '/',
            }) 
        }
        res.end();
    })
}

const auth = (req, res) => {
    let cookies = {};
    if (req.headers.cookie) {
        cookies = cookie.parse(req.headers.cookie);
    }
    if (cookies.id === 'jnho' && cookies.password === '0000')
        return (true);
    return (false)
}

const server = http.createServer(async function (req, res) {
    try {
        const parsedUrl = url.parse(req.url, true);
        if (parsedUrl.pathname === '/') {
            responsePage(req, res, 'basic', parsedUrl);
        } else if (parsedUrl.pathname === '/login') {
            responsePage(req, res, 'login', parsedUrl);
        } else if (parsedUrl.pathname === '/create') {
            responsePage(req, res, 'create', parsedUrl);
        } else if (parsedUrl.pathname === '/update') {
            responsePage(req, res, 'update', parsedUrl);
        } else if (parsedUrl.pathname === '/author') {
            responsePage(req, res, 'author', parsedUrl);
        } else if (parsedUrl.pathname === '/author_update') {
            responsePage(req, res, 'author_update', parsedUrl);
        } else if (parsedUrl.pathname === '/author_create') {
            responsePage(req, res, 'author_create', parsedUrl);
        } else if (parsedUrl.pathname === '/create_process') {
            process(req, res, 'create', parsedUrl);
        } else if (parsedUrl.pathname === '/update_process') {
            process(req, res, 'update', parsedUrl);
        } else if (parsedUrl.pathname === '/delete_process') {
            process(req, res, 'delete', parsedUrl);
        } else if (parsedUrl.pathname === '/author_update_process') {
            process(req, res, 'author_update', parsedUrl);
        } else if (parsedUrl.pathname === '/author_create_process') {
            process(req, res, 'author_create', parsedUrl);
        } else if (parsedUrl.pathname === '/author_delete_process') {
            process(req, res, 'author_delete', parsedUrl);
        } else if (parsedUrl.pathname === '/login_process') {
            process(req, res, 'login', parsedUrl);
        } else if (parsedUrl.pathname === '/logout_process') {
            process(req, res, 'logout', parsedUrl)
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