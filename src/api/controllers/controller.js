const dbConfig = require('../../config/dbConfig');
const { uploadImageS3 } = require('../services/services')

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
        if (errTrans) { next(errTrans); return;}
        let query = (`
          INSERT INTO main.uploads (description, type, size) 
          VALUES ('${req.body['description']}', '${req.file.mimetype}', '${req.file.size}')
        `)
        connection.query(query, async (errInsert) => {
          if (errInsert) { 
              connection.rollback((errRollback) => {
                next(errRollback);
              });
              return;
           }
          try {
            // RDS insert
            const objectParams = {
              Key: req.file.originalname,
              Body: req.file.buffer
            };
            await uploadImageS3(objectParams);
          } catch (errS3) {
            // rollback upload
            console.log('RDS error: ')
            console.log(errS3)
            connection.rollback((errRollback) => {
              next(errRollback);
            });
            next(errS3);
          }
        })
      })
      connection.commit(function(errCommit) {
        if (errCommit) { 
          connection.rollback(function(errRoll) {
            next(errRoll);
          });
          next(errCommit);
        }
        console.log('Transaction Complete.');
        connection.release();
      });
    })
    res.status(201).send()
  }