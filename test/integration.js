/* eslint-env mocha */
const testDb = require('./config/test-db')
const testServer = require('./test-server')
const testS3 = require('./config/test-S3config')
const path = require('path');
const { expect } = require('chai');


describe('POST /upload', function() {
    testDb.useInTest()
    testServer.useInTest()
    // testS3.useInTest()
    
    it('responds with 201 for valid upload', async function() {
        const api = this.api
       
        return api
            .post('/upload')
            .field('description', 'test')
            .attach('uploadFile',path.join(__dirname, './mocks/mock-jpeg.jpg'))
            .expect(201)
    })
    // it('responds with 400 for no params', async function() {
    //     const api = this.api
        
    //     api.post('/upload').expect(400)
    // })

    // it('responds with 400 for no description', async function() {
    //     const api = this.api

    //     return api
    //     .post('/upload')
    //     .attach('uploadFile',path.join(__dirname, './mocks/mock-jpeg.jpg'))
    //     .expect(400)
    // })

    // it('responds with 400 for no file', async function() {
    //     const api = this.api

    //     return api
    //     .post('/upload')
    //     .field('description', 'test')
    //     .expect(400)
    // })

    // it('responds with 500 when database is badly configured', async function() {
    //     const api = this.api

    //     var sql = "DROP DATABASE IF EXISTS test"; 


    //     this.pool.getConnection(function (err, con) {
    //         if (err) throw err;
    //         con.query(sql, function (error, result, fields) {
    //             if (error)
    //                 console.log('Create test db failed: ' + error)
    //             console.log("Table created: " + result);
    //         });
    //         con.release()        
    //     });

    //     return api
    //     .post('/upload')
    //     .field('description', 'test')
    //     .attach('uploadFile',path.join(__dirname, './mocks/mock-jpeg.jpg'))
    //     .expect(500)
    // })

    // it('responds with 500 when s3 is badly configured', async function() {
    //     const api = this.api
        
    //     try {
    //         console.log(`Deleting contents...`);
    //         // We can't delete a bucket before emptying its contents
    //         const { Contents } = await this.s3.listObjects({ Bucket: aws_bucket }).promise();
    //         if (Contents.length > 0) {
    //           await this.s3
    //             .deleteObjects({
    //               Bucket: aws_bucket,
    //               Delete: {
    //                 Objects: Contents.map(({ Key }) => ({ Key }))
    //               }
    //             })
    //             .promise();
    //         }
    //         let ret = await this.s3.deleteBucket({ Bucket: aws_bucket }).promise();
    //         console.log("Bucket deletion: " + ret)
    //       } catch (err) {
    //           console.log("Failed deletion")
    //           return false;
    //       }

    //     return api
    //     .post('/upload')
    //     .field('description', 'test')
    //     .attach('uploadFile',path.join(__dirname, './mocks/mock-jpeg.jpg'))
    //     .expect(500)

        
    // })
    
    
})
