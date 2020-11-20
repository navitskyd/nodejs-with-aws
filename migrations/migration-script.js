require('dotenv').config()
const dbconfig = require('./configs/dbConfig')

 function migrateDb() {
  const pool = dbconfig.dbPool;

  /*
    Schema
    id: number = AutoIncrement [PrimaryKey]
    description: string = null
    type: string
    size: number
  */
  
  pool.getConnection((err, con) => {
    if (err) {
      console.log(err);
      return;
    }
    
      console.log('Connected to database.');
    
      con.query('CREATE DATABASE IF NOT EXISTS main;');
        con.query('USE main;');
        con.query('CREATE TABLE IF NOT EXISTS uploads(id int NOT NULL AUTO_INCREMENT, description varchar(256), type varchar(30), size int, PRIMARY KEY(id));', function(error, result, fields) {
            console.log(result);
        });
    })
  
  
}

migrateDb();


