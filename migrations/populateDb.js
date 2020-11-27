const DbDriver = require('../src/config/dbConfig')
const DbDao = require('../src/api/services/database')
const fs = require('fs');
const path = require('path');

async function populateDb() {
    const db = new DbDriver();
    const dbDao = new DbDao(db);

    /*
      Schema
      id: number = AutoIncrement [PrimaryKey]
      description: string = null
      type: string
      size: number
    */
    try {
        await db.connect();
        await db.query('CREATE DATABASE IF NOT EXISTS main;');
        await db.query('USE main;');
        await dbDao.createTable();
        let rawdata = fs.readFileSync(path.join(__dirname, './data/request-data.json'));
        let data = JSON.parse(rawdata);
        let values = []
        for(var i=0; i< data.length; i++) {
            values.push([data[i].description,data[i].type,data[i].size]);
        }
        await db.query('INSERT INTO uploads (description, type, size) VALUES ?', [values])
        console.log('INIT AND SEED OF DB SUCCESS')
        console.log(await db.query('SELECT COUNT(*) FROM uploads;'))
    } catch (err) {
        console.log("FAILED TO INIT DB: ")
        console.log(err)
    }
    db.disconnect()
}

populateDb()