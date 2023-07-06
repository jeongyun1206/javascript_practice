const { response } = require('express');
var express = require('express')
var app = express()
var fs = require('fs');
const mysql = require('mysql');
const db = require('./lib/database.js');
const bodyParser = require('body-parser');
var template = require('./lib/template.js');
const { getRandomValues } = require('crypto');

app.use(bodyParser.urlencoded({ extended: false}));

app.get('/', function (request, response) {
  db.query('SELECT * FROM topic', (err, topics) => {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(topics);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    response.send(html);
  });
});

app.get('/page/:pageId', function (request, response) {
  db.query('SELECT * FROM topic', (list_err, topics) => {
    var list = template.list(topics);
    db.query('SELECT * FROM topic WHERE id=?', [request.params.pageId], (topic_err, topic) => {
      let html = template.HTML(topic[0].title, list, 
        `<h2>${topic[0].title}</h2> ${topic[0].description}`, 
        `<a href="/create">create</a>`);
      response.send(html);
    })
  });
});

app.get('/create', (request, response) => {
  db.query('SELECT * FROM topic', (list_err, topics) => {
    if(list_err) console.log(list_err);
    var list = template.list(topics);
    console.log(list);
    var html = template.HTML('create', list, `
            <form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
          `, '');
    response.send(html);
  })
});

app.post('/create_process', (request, response) => {
  let body = request.body;
  db.query('INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, ?, ?)', 
  [body.title, body.description, 1, 1],
  (insert_err, topic) => {
    response.redirect('/');
  });
});

app.listen(3000, function () {
});
