const Services = require('./services');
require('dotenv').config()


module.exports = {

  async search(req, res) {
    const offset = req.query.p * 20;
    const min = req.query.mn;
    const max = req.query.mx;
    const description = req.query.d;
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
      //   res.json({status_code: 200, success: true, data: data, messsage: "fetch for search query success" });
      res.status(200).send(data)
    } catch (err) {
      // TODO remove log
      console.log(err)
      // TODO add 204 for no results
      //   res.json({status_code: 500, success: false, data: [], message: err});
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
      const objectParams = { Bucket: process.env.AWS_BUCKET_NAME, Key: req.file.originalname, Body: req.file.buffer };
      await Services.uploadImageS3(objectParams);
      try {
        // RDS insert
        await Services.uploadImageRDS(req)
      }
      catch {
        // rollback S3 upload
        await Services.deleteImageS3(objectParams)
        throw ('Failed to upload to MySQL instance')
      }
    } catch (err) {
      res.status(500).send(err)
    }
    res.status(201).send('File uploaded');
  }

}
