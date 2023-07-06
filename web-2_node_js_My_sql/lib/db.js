var mysql = require('mysql');
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '0602036njy@',
        database: 'lifecoding',
    }
);
db.connect();

module.exports = db;