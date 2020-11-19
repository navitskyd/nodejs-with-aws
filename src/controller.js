const Services = require('./services');
const dbconfig = require('../configs/dbConfig');


module.exports = {

  async search(req, res) {
    const offset = req.query.p * 20;
    const min = req.query.mn;
    const max = req.query.mx;
    const description = decodeURIComponent(req.query.d);
    const fileType = req.query.t;

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

  // TODO move the contents of this to services and set up try catches
  async upload(req, res) {
    if (req.file === undefined) {
      res.status(400).send("File is undefined");
      return;
    }
    if (!req.body['description'] || !req.file.mimetype || !req.file.size) {
      res.status(400).send('Missing a parameter');
      return;
    }
    // S3 upload
    try {
      // TODO check file type?
      const objectParams = {
        Key: req.file.originalname,
        Body: req.file.buffer
      };
      const uploadRequest = await Services.uploadImageS3(objectParams);
      try {
        // RDS insert
        const pool = await dbconfig.dbPool;
        let query = `INSERT INTO main.uploads (description, type, size) ` +
          `VALUES ('${req.body['description']}', '${req.file.mimetype}', '${req.file.size}')`
        await pool.query(query);
        // pool.getConnection((err, conn) => {
        //   if (err) {
        //     if (conn) {
        //       conn.release();
        //     }
        //     console.log(err)
        //     throw err;
        //   }
        //   let query = `INSERT INTO main.uploads (description, type, size) ` +
        //   `VALUES ('${req.body['description']}', '${req.file.mimetype}', '${req.file.size}')`
        //   conn.query(query, function (error, rows) {
        //     conn.release();
        //   });
        //   conn.on('error', function (error) {
        //     conn.release();
        //     throw error;
        //   });
        // });
      } catch (err) {
        // rollback S3 upload
        console.log('RDS error: ')
        console.log(err)
        uploadRequest.abort();
        console.log("deleted")
        throw ('Failed to upload to MySQL instance')
      }
    } catch (err) {
      console.log('top level error: ')
      console.log(err)
      res.status(500).send(err)
      return;
    }
    res.status(201).send();
  }

}