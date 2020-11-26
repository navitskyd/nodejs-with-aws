'use strict'
var util = require('util')
const { dbConfig } = require('./vars');
const mysql = require("mysql");

const pool = mysql.createPool({
    connectionLimit: 10,
    host     : dbConfig.db_host,
    user     : dbConfig.db_user,
    password : dbConfig.db_password,
    port     : dbConfig.db_port
  });

  pool.getConnection((err, connection) => {
    if (err) {
        console.error('DB connection failure')
    }
    if (connection) connection.release()
    return
})

pool.query = util.promisify(pool.query)

module.exports= { dbPool: pool, db: dbConfig.db_db};