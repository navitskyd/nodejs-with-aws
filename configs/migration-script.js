require('dotenv').config()
const dbconfig = require('./dbConfig')

const dbPool = dbconfig.dbPool;

/*
  Schema
  id: number = AutoIncrement [PrimaryKey]
  description: string = null
  type: string
  size: number
*/

const connection = await dbPool.getConnection();


connection.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }

  console.log('Connected to database.');

  con.query('CREATE DATABASE IF NOT EXISTS main;');
    con.query('USE main;');
    con.query('CREATE TABLE IF NOT EXISTS uploads(id int NOT NULL AUTO_INCREMENT, description varchar(256), type varchar(30), size int, PRIMARY KEY(id));', function(error, result, fields) {
        console.log(result);
    });
    con.end();
});

