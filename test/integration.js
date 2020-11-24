/* eslint-env mocha */
const testServer = require('./test-server')
const testDb = require('./config/test-db')
const path = require('path');

describe('POST /upload', function() {
    testServer.useInTest()
    testDb.useInTest()

    it('responds with 400 for no params', async function() {
        const api = this.api
        
        api.post('/upload').expect(400)
    })

    it('responds with 400 for no description', async function() {
        const api = this.api

        return api
        .post('/upload')
        .attach('uploadFile',path.join(__dirname, './mocks/mock-jpeg.jpg'))
        .expect(400)
    })

    it('responds with 400 for no file', async function() {
        const api = this.api

        return api
        .post('/upload')
        .field('description', 'test')
        .expect(400)
    })
    
    it('responds with 201 for valid upload', async function() {
        const api = this.api
       
        return api
            .post('/upload')
            .field('description', 'test')
            .attach('uploadFile',path.join(__dirname, './mocks/mock-jpeg.jpg'))
            .expect(201)
    })
})