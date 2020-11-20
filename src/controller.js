const Services = require('./services');
const dbconfig = require('./configs/dbConfig');


module.exports = {

  async search(req, res) {
    const offset = req.query.p * 20;
    const min = req.query.mn;
    const max = req.query.mx;
    const description = decodeURIComponent(req.query.d);
    const fileType = decodeURIComponent(req.query.t);

    // TODO remove log
    console.log(offset)
    console.log(min)
    console.log(max)
    console.log(description)
    console.log(fileType)

    try {
      const result = await Services.search(offset, min, max, description, fileType);
      const data = result.hits.hits
      // TODO remove log
      console.log(data)
      if (data.length == 0) {
        res.sendStatus(204)
        return;
      }
      res.status(200).send(data)
    } catch (err) {
      // TODO remove log
      console.log(err)
      res.status(500).send(err)
    }
  },

  async upload(req, res, next) {
    if (req.file === undefined) {
      res.status(400).send('File is undefined');
      return;
    }
    if (!req.body['description'] || !req.file.mimetype || !req.file.size) {
      res.status(400).send('Missing a parameter');
      return;
    }
    // TODO check file type?
    
    const pool = await dbconfig.dbPool;
    
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
            await Services.uploadImageS3(objectParams);
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

}