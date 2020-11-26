
/* eslint-env mocha */

const mysql = require("mysql");
const { dbConfig } = require('../../src/config/vars');
const MockedDb = require("../../util/MockedDb");

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

