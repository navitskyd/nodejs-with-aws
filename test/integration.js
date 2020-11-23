const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();
const expect = chai.expect;

// describe('GET /search', () => {
//     it('should return a list of the first 20 items', done => {
//       chai
//         .request(app)
//         .get('/films-list')
//         .end((err, res) => {
//           res.should.have.status(200);
//           expect(res.body).to.deep.equal(starwarsFilmListMock);
//           done();
//         });
//     });
//   });


describe('GET /search', function() {
    testServer.useInTest() // Provide a test server
    testDb.useInTest() // Connect to database and reset it between tests
    it('should return a list of the first 20 items', async function() {
        const api = this.api // An axios client with its baseURL set to the test server
        const db = this.db // A mongodb database client
    })
})

// test 201 for successful upload

// test 400 for missing upload parameter

// test 500 for unexpected errors

// test 200 for search result success

// test 204 for no search results found

// test 500 for unexpected search errors