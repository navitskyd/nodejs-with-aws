'use strict'
const AWS = require("aws-sdk");
var util = require('util')

AWS.config.getCredentials(function (err) {
  if (err) console.log(err.stack);
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
  }
});

const config = require('./config');
const mysql = require("mysql")

const pool = mysql.createPool({
    connectionLimit: 10,
    host     : config.db_host,
    user     : config.db_user,
    password : config.db_password,
    port     : config.db_port
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