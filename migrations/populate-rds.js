const dbconfig = require('../src/configs/dbConfig')
const fs = require('fs');
require('dotenv').config()

function populateDb() {
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
        con.query('CREATE TABLE IF NOT EXISTS uploads(id int NOT NULL AUTO_INCREMENT, description varchar(256), type varchar(30), size int, PRIMARY KEY(id));', function (error, result, fields) {
            console.log(result);
        });

        let rawdata = fs.readFileSync('request-data.json');
        let data = JSON.parse(rawdata);
        let values = []
        for(var i=0; i< data.length; i++) {
            values.push([data[i].description,data[i].type,data[i].size]);
            console.log(data[i])
        }
        //let responseJson = JSON.stringify(data);

        con.query('INSERT INTO uploads (description, type, size) VALUES ?', [values], function(err,result) {
            if(err) {
                console.log(err);
            }
           else {
            console.log(result);
            con.release()
            pool.end()
            }
          });
    })

}

populateDb();

