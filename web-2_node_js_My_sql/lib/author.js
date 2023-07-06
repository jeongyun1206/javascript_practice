var db = require('./db');
var template = require('./template');
var qs = require('querystring');
var url = require('url');
const { request } = require('http');

exports.home = (request, response) =>   
{
  db.query(`SELECT * FROM topic`, (error, topics) => {
    db.query(`SELECT * FROM author`, (error, authors) => {
      var list = template.list(topics);
      var title = "author";
      let tag = template.authorTable(authors);
      var html = template.HTML(title, list,
        `${tag}
        <form action="/author/create_process" method="post">
          <p><input type="input" name="name" placeholder="name"></p>
          <p>
            <textarea name="profile" placeholder="profile"></textarea>
          </p>
          <p>
            <input type="submit" value="create">
          </p>
        </form>`,''); 
      response.writeHead(200);
      response.end(html);
    })
  });
}

exports.create_process =(request, response) => 
{
  var body = '';
  request.on('data', (data) => {
    body = body + data;
  });
  request.on('end', () => {
    var post = qs.parse(body);
    db.query(`INSERT INTO author (name, profile) 
                VALUES (?, ?)` ,
      [post.name, post.profile],
      (error, result) => {
        if (error) { throw error; }
        response.writeHead(302, {location: `/author`});
        response.end();
      })
  });
}

exports.update = (request, response, queryData) =>
{
  db.query(`SELECT * FROM topic`, (error, topics) => {
    if (error) throw error;
    db.query(`SELECT * FROM author`, (error1, authors) => {
      if (error1) throw error1;
      db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], (error2, author) => {
        if (error2) throw error2;
        var list = template.list(topics);
        var title = "author";
        let tag = template.authorTable(authors);
        var html = template.HTML(title, list,
          `${tag}
          <form action="/author/update_process" method="post">
            <input type="hidden" name="id" value=${author[0].id}>
            <p><input type="text" name="name" placeholder="name" value=${author[0].name}></p>
            <p>
              <textarea name="profile" placeholder="profile">${author[0].profile}</textarea>
            </p>
            <p>
              <input type="submit" value="update">
            </p>
          </form>`,''); 
        response.writeHead(200);
        response.end(html);
      });
    })
  });   
}

exports.update_process = (request, response) =>
{
  var body = '';
  request.on('data', function (data) {
    body = body + data;
  });
  request.on('end', function () {
    var post = qs.parse(body);
    db.query(`UPDATE author SET name=?, profile=? WHERE id=?`,
      [post.name, post.profile, post.id],
      (updateError, updateResult) => {
        if(updateError) throw updateError;
        response.writeHead(302, { Location: `/author` });
        response.end();
      });
  });
}