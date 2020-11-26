const mysql      = require('mysql');
const util       = require('util');

class DbDriver {
   constructor(config) {
       this.config = config;
       this.connection = undefined;
       this.rollback = undefined;
   }

   async connect() {
       this.connection = mysql.createConnection(this.config);

       this.connection.connectPromise = (await util.promisify(this.connection.connect)).bind(this.connection);

       await this.connection.connectPromise();

       Object.keys(this.connection.__proto__).forEach(async key => {
           if(typeof this.connection.__proto__[key] === 'function')
               this.connection[`${key}Promise`] = (await util.promisify(this.connection[key])).bind(this.connection);   
       });
   }

   async query(query, params = []) {
       if(!this.connection || this.connection.state === 'disconnected') {
           await this.connect();
       }
       return this.connection.queryPromise(query, params);
   }
}

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