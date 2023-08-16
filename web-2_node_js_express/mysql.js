const mysql = require('mysql');
const util = require('util');

const db = mysql.createConnection({
    host        : 'localhost',
    user        : 'root',
    password    : '0000',
    database    : 'life_coding',
});

db.connect();

const query = util.promisify(db.query).bind(db);

module.exports = {db, query};