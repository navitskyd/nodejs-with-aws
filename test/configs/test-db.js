
/* eslint-env mocha */

const config = require('./test-config');
const mysql = require("mysql");

exports.useInTest = function() {
    before(async function connectToTestDB() {

        const pool = mysql.createPool({
            connectionLimit: 10,
            host     : config.db_host,
            user     : config.db_user,
            password : config.db_password,
            port     : config.db_port
          });

        pool.getConnection((err, con) => {
        if (err) {
            console.log(err);
            return;
        }
        
            console.log('Connected to database.');
        
            con.query('CREATE DATABASE IF NOT EXISTS test;');
            con.query('USE test;');
            con.query('CREATE TABLE IF NOT EXISTS uploads(id int NOT NULL AUTO_INCREMENT, description varchar(256), type varchar(30), size int, PRIMARY KEY(id));', function(error, result, fields) {
                console.log(result);
                con.release();
                pool.end()
            });
            
            this.connection = con;
        })
        this.pool = pool;
    })
    beforeEach(function dropTestDB() {
        return pool.getConnection((err, con) => {
            if (err) {
                console.log(err);
                return;
            }
            var sql = "DROP DATABASE IF EXISTS test";  
            con.query(sql, function (err, result) {  
            if (err) throw err;  
            console.log("Table deleted");  
            });
            con.release()
        })
    })
    after(function disconnectTestDB() {
        return this.pool.end()
    })
}