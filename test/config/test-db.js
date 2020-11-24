
/* eslint-env mocha */

const mysql = require("mysql");
const { dbConfig } = require('../../src/config/vars');

exports.useInTest = function() {
    before(async function connectToTestDB() {

        const pool = mysql.createPool({
            connectionLimit: 10,
            host     : dbConfig.db_host,
            user     : dbConfig.db_user,
            password : dbConfig.db_password,
            port     : dbConfig.db_port
          });

        pool.getConnection(function (err, con) {
        if (err) {
            console.log(err);
            return;
        }
        
            console.log('Connected to database.');
        
        })
        this.pool = pool;
    })
    beforeEach(function dropTestDB() {
        return this.pool.getConnection(function (err, con) {
            if (err) {
                console.log(err);
                return;
            }
            var sql = "DROP DATABASE IF EXISTS test";  
            con.query(sql, function (errDrop, result) {  
            if (errDrop) throw err;  
            console.log("Table deleted");  
            });

            con.query('CREATE DATABASE IF NOT EXISTS test;');
            con.query('USE test;');
            con.query('CREATE TABLE IF NOT EXISTS uploads(id int NOT NULL AUTO_INCREMENT, description varchar(256), type varchar(30), size int, PRIMARY KEY(id));', function(error, result, fields) {
                console.log(result);
            });
            con.release()
        })
    })
    after(function disconnectTestDB() {
        var sql = "DROP DATABASE IF EXISTS test"; 
        this.pool.getConnection(function (err, con) {

            con.query(sql, function (errDrop, result) {  
            if (errDrop) throw err;  
            console.log("Table deleted");  
            });
            con.release()

        })

        return this.pool.end()
    })
}