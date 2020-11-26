
/* eslint-env mocha */

const mysql = require("mysql");
const { dbConfig } = require('../../src/config/vars');
const MockedDb = require("../util/db-driver");

exports.useInTest = function () {
    before(function connectToTestDB() {

        // const con = mysql.createConnection({
        //     host: dbConfig.db_host,
        //     user: dbConfig.db_user,
        //     password: dbConfig.db_password,
        //     port: dbConfig.db_port,
        //     multipleStatements: true
        // });

        // const pool = mysql.createPool({
        //     connectionLimit : 10,
        //     host: dbConfig.db_host,
        //     user: dbConfig.db_user,
        //     password: dbConfig.db_password,
        //     port: dbConfig.db_port,
        //     multipleStatements: true
        // })

        // pool.getConnection(function (err, con) {
        //     if (err) throw err;
        //     console.log("Connected!");
        //     // con.query('CREATE DATABASE IF NOT EXISTS test');
        //     // con.release()
        // });

        // this.pool = pool;
        let config = {
            host: dbConfig.db_host,
            user: dbConfig.db_user,
            password: dbConfig.db_password,
            port: dbConfig.db_port,
            database: dbConfig.db_db
        }
        this.mockedDb = new MockedDb(config);


    })
    afterEach(async () => {
        await this.mockedDb.rollback();
    });
    // beforeEach(function dropTestDB() {
    //     this.pool.getConnection(function (err, con) {
    //         if (err) throw err;
    //         con.query('DROP TABLE IF EXISTS test.uploads; CREATE IF NOT EXISTS TABLE test.uploads(id int NOT NULL AUTO_INCREMENT, description varchar(256), type varchar(30), size int, PRIMARY KEY(id))', function (error, result, fields) {
    //             if (error)
    //                 console.log('Create test db failed: ' + error)
    //             console.log("Table created: " + result);
    //         });
    //         // con.release()        
    //     });
    // })
    // after(function disconnectTestDB() {
    //     var sql = "DROP TABLE IF EXISTS test.uploads";

    //     this.pool.getConnection(function (err, con) {
    //         if (err) throw err;
    //         con.query(sql, function (errDrop, result) {
    //             if (errDrop) throw err;
    //             console.log("Table deleted");
    //         });            
    //         // con.release()
    //     });

    // })
}

