const DbDriver = require('../src/config/dbConfig')

class MockedDb extends DbDriver{
    async connect() {
        await DbDriver.prototype.connect.call(this);
        await this.connection.beginTransactionPromise();
        this.rollback = this.connection.rollbackPromise;
        this.connection.commitPromise = () => Promise.resolve();
        this.connection.beginTransactionPromise = () => Promise.resolve();
        this.connection.rollbackPromise = () => Promise.resolve();
    }
    async query(...args) {
        return DbDriver.prototype.query.call(this, ...args);
    }
};

module.exports = MockedDb;