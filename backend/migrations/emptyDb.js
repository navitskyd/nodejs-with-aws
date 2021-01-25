const DbDriver = require('../src/config/dbConfig')
const DbDao = require('../src/api/services/database')
const { dbConfig } = require('../src/config/vars')

async function emptyDb() {
    const db = new DbDriver();
    const dbDao = new DbDao(db);

    try {
        await db.connect();
        await db.query(`USE ${dbConfig.db_db};`);
        await dbDao.dropTable();
        console.log('EMPTY DB SUCCESS')
    } catch (err) {
        console.log("FAILED TO EMPTY DB: ")
        console.log(err)
    }
    db.disconnect()
}

emptyDb();


