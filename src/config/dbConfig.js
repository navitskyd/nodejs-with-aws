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
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
})

pool.query = util.promisify(pool.query)

module.exports.dbPool= pool;