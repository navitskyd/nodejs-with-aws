const dbconfig = require('../src/configs/dbConfig')
const fs = require('fs');
require('dotenv').config()

function emptyDb() {
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
        var sql = "DROP TABLE IF EXISTS main.uploads";  
        con.query(sql, function (err, result) {  
        if (err) throw err;  
        console.log("Table deleted");  
        });
        con.release()
        pool.end()
    })

    

}

emptyDb();


