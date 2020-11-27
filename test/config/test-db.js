/* eslint-env mocha */

const MockedDb = require("../mocks/MockedDb");

exports.useInTest = function () {
    beforeEach(async function connectToTestDB() {
        this.mockedDb = new MockedDb();
        await this.mockedDb.connect();
    })
    afterEach(async function endConnectionToTestDB() {
        await this.mockedDb.rollback();
        this.mockedDb.disconnect();
    });
}

