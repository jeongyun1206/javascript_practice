const http = require('http');
const fs = require('fs').promises;
const querystring = require('querystring');

const getParsedQueryString = function (url) {
    const qs = url.split('?')[1];
    const parsedQueryString = querystring.parse(qs);
    return (parsedQueryString)
}

const getTemplate = async function(url) {
    let title;
    if (url == '/') {
        title = 'welcome'
    } else {
        title = getParsedQueryString(url).id;
    }
    console.log('title', title, 'url', url);
    let description = await fs.readFile(__dirname + '/pageData/' + title, 'utf-8')
    const template = `
<!doctype html>
<html>
<head>
  <title>WEB1 - ${title}</title>
  <meta charset="utf-8">
</head>
<body>
  <h1><a href="/">WEB</a></h1>
  <ol>
    <li><a href="?id=HTML">HTML</a></li>
    <li><a href="?id=CSS">CSS</a></li>
    <li><a href="?id=javaScript">JavaScript</a></li>
  </ol>
  <h2>${title}</h2>
  <p>
    ${description}
  </p>
</body>
</html>
`
    return (template);
}

const server = http.createServer(async function (req, res) {
    try {
        let url = req.url;
        if (url == '/favicon.ico') {
            return (res.writeHead(404));
        }
        res.writeHead(200);
        template = await getTemplate(url);
        res.end(template);
    } catch (err) {
        console.log(err);
    }
});

server.listen(8080);