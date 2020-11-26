const dbConfig = require('../../config/dbConfig');
const { uploadImageS3 } = require('../services/services')
const { env } = require('../../config/vars')

const handleCommit = (errCommit, connection, next) => {
  if (errCommit) {
    connection.rollback(function (errRoll) {
      next(errRoll);
    });
    next(errCommit);
    connection.release();
    return false;
  }
  console.log('Transaction Complete.');
  connection.release();
  return true;
}

const handleInsert = (errInsert, connection, next) => {
  if (errInsert) {
    connection.rollback((errRollback) => {
      next(errRollback);
    });
    next(errInsert);
    console.log(errInsert)
    connection.release();
    return false
  }
  return true
}

if (env === 'test') {
  module.exports.handleCommit = handleCommit
  module.exports.handleInsert = handleInsert
}

exports.upload = async (req, res, next) => {
  if (req.file === undefined) {
    res.status(400).send('File is undefined');
    return;
  }
  if (!req.body['description'] || !req.file.mimetype || !req.file.size) {
    res.status(400).send('Missing a parameter');
    return;
  }

  const pool = await dbConfig.dbPool;

  pool.getConnection((errConnection, connection) => {
    if (errConnection) { next(errConnection); return; }
    connection.beginTransaction((errTrans) => {
      if (errTrans) { next(errTrans); return; }
      let query = (`
          INSERT INTO ${dbConfig.db}.uploads (description, type, size) 
          VALUES ('${req.body['description']}', '${req.file.mimetype}', '${req.file.size}')
        `)
      connection.query(query, async (errInsert) => {
        if (!handleInsert(errInsert, connection, next)) {
          res.status(500).send('Failed DB insert');
          return;
        }
        try {
          const objectParams = {
            Key: req.file.originalname,
            Body: req.file.buffer
          };
          await uploadImageS3(objectParams);
          connection.commit(function (errCommit) {
            if (!handleCommit(errCommit, connection, next))
              res.status(500).send('Failed DB insert');
            res.status(201).send()
          });
        } catch (errS3) {
          // rollback upload
          console.log('S3 error: ')
          console.log(errS3)
          connection.rollback((errRollback) => {
            next(errRollback);
          });
          res.status(500).send('Failed S3 insert');
          next(errS3);
        }
      })
    })
  })
}