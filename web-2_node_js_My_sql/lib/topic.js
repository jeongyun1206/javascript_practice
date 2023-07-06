var db = require('./db');
var template = require('./template'); 
var qs = require('querystring');


exports.home =
  (request, response) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
      var title = 'Welcome';
      var description = 'Hello, Node.js';
      var list = template.list(topics);
      var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a>`);
      response.writeHead(200);
      response.end(html);
    });
  }

exports.page =
  (request, response, queryData) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
      if (error) { throw error; }
      db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
        [queryData.id], (error2, topic) => {
          if (error2) { throw error2; }
          var title = topic[0].title;
          var list = template.list(topics);
          let description = topic[0].description;
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}
                <p>by ${topic[0].name}</p>`,
            `<a href="/create">create</a>
                <a href = "/update?id=${queryData.id}" > update</a >
                <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}">
                  <input type="submit" value="delete">
                </form>`
          );
          response.writeHead(200);
          response.end(html);
        });
    });
  }

exports.create = 
  (request, response) => {
    db.query(`SELECT * FROM topic`, (error, topics) => {
      db.query(`SELECT * FROM author`, (error, authors) => {
        var title = 'create';
        var list = template.list(topics);
        var html = template.HTML(title, list, `
            <form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                ${template.authorSelect(authors)}
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
          `, '');
        response.writeHead(200);
        response.end(html);
      })
    });
  }

exports.create_process =
  (request, response) => {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      db.query(`INSERT INTO topic (title, description, created, author_id) 
                  VALUES (?, ?, NOW(), ?)` ,
        [post.title, post.description, post.author],
        (error, result) => {
          if (error) { throw error; }
          response.writeHead(302, { Location: `/?id=${result.insertId}` });
          response.end();
        })
    });
  }

exports.update = 
  (request, response, queryData) => {
    db.query(`SELECT * FROM topic`, (error_list, topics) => {
      if (error_list) throw error_list;
      db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], (error, topic) => {
        if (error) throw error;
        db.query(`SELECT * FROM author`, (error, authors) => {
          if (error) throw error;
          console.log(topic);
          var list = template.list(topics);
          var html = template.HTML(topic[0].title, list, `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value=${topic[0].id}> 
                <p><input type="text" name="title" placeholder="title" value=${topic[0].title}></p>
                <p>
                  <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                </p>
                <p>
                  ${template.authorSelect(authors, topic[0].author_id)}
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
            `, '');
          response.writeHead(200);
          response.end(html);
        })
      })
    })
  }

exports.update_procss =
  (request, response) => {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`,
        [post.title, post.description, post.author, post.id],
        (updateError, updateResult) => {
          response.writeHead(302, { Location: `/?id=${post.id}` });
          response.end();
        });
    });
  }

exports.delete_process =
  (request, response) => {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', () => {
      var post = qs.parse(body);
      db.query(`DELETE FROM topic WHERE id=?`, [post.id], (error, result) => {
        if (error) throw error;
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  }