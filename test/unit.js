/* eslint-env mocha */
const { handleCommit, handleInsert } = require('../src/api/controllers/controller')
const { expect } = require('chai')
const { dbConfig } = require('../src/config/vars');
const mysql = require("mysql");

    describe('unit tests', () => {

        // it('should return true if no error on commit', () => {
        //     // couldn't get this.con from the testDb to work here for some reason
        //     const pool = mysql.createPool({
        //         host: dbConfig.db_host,
        //         user: dbConfig.db_user,
        //         password: dbConfig.db_password,
        //         port: dbConfig.db_port
        //     });
    
        //     pool.getConnection(function (err, connection) {
        //         if (err) throw err;
        //         console.log("Connected!");
        //         connection.beginTransaction((errTrans) => {})
        //         expect(handleCommit(null, connection, (param) => {return param})).to.be.true
        //     });
        
        // })
        // it('should return false if  error on commit', () => {

        //     const pool = mysql.createPool({
        //         host: dbConfig.db_host,
        //         user: dbConfig.db_user,
        //         password: dbConfig.db_password,
        //         port: dbConfig.db_port
        //     });
    
        //     pool.getConnection(function (err, connection) {
        //         if (err) throw err;
        //         console.log("Connected!");
        //         connection.beginTransaction((errTrans) => {})
        //         expect(handleCommit('error', connection, (param) => {return param})).to.be.false
        //     });
        // }) 

        // it('should return true if no error on insert', () => {
        //     // couldn't get this.con from the testDb to work here for some reason
        //     const pool = mysql.createPool({
        //         host: dbConfig.db_host,
        //         user: dbConfig.db_user,
        //         password: dbConfig.db_password,
        //         port: dbConfig.db_port
        //     });
    
        //     pool.getConnection(function (err, connection) {
        //         if (err) throw err;
        //         console.log("Connected!");
        //         connection.beginTransaction((errTrans) => {})
        //         expect(handleInsert(null, connection, (param) => {return param})).to.be.true
        //     });
        
        // })
        // it('should return false if  error on insert', () => {

        //     const pool = mysql.createPool({
        //         host: dbConfig.db_host,
        //         user: dbConfig.db_user,
        //         password: dbConfig.db_password,
        //         port: dbConfig.db_port
        //     });
    
        //     pool.getConnection(function (err, connection) {
        //         if (err) throw err;
        //         console.log("Connected!");
        //         connection.beginTransaction((errTrans) => {})
        //         expect(handleInsert('error', connection, (param) => {return param})).to.be.false
        //     });
        // }) 

    })

        

    