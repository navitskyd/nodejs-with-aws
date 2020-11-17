'use strict'

const AWS = require("aws-sdk");
const config = require('./config');
const mysql = require("mysql")
const client = mysql.createConnection({
    host     : config.db_host,
    user     : config.db_user,
    password : config.db_password,
    port     : config.db_port
  });

AWS.config.getCredentials(function (err) {
    if (err) console.log(err.stack);
    else {
      console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
  });

module.exports.dbClient= client;