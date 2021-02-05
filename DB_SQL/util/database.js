const mysql = require('mysql2');

//creating new connection all the times becomes quickly inefficient so we use a connection pool

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'DB',
    password: 'password'
});

module.exports = pool.promise();//returns a promise