const Services = require('./services');
// TODO delete this is moving upload to services ?
const dbconfig = require('../configs/dbConfig');
const dbClient = dbconfig.dbClient;
const AWS = require("aws-sdk");
require('dotenv').config()


module.exports = {

  async search(req,res) {
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
    //   const data = result.body.hits.hits.map((image)=>{
    //     return {
    //       id: image._id,
    //       data: image._source
    //     }

    //   })
      // TODO remove log
      console.log(data)
    //   res.json({status_code: 200, success: true, data: data, messsage: "fetch for search query success" });
      res.status(200).send(data)
    } catch (err) {
        console.log(err)
        // TODO add 204 for no results
    //   res.json({status_code: 500, success: false, data: [], message: err});
    res.status(500).send(err)
    }
  },

  // TODO move the contents of this to services and set up try catches
  async upload(req, res) {
    // upload(req, res, function (err) {
      // check for error thrown by multer- file size etc
      // TODO check file types
      if (req.file === undefined) {
        //console.log(err)
        res.status(400).send("error occured")
      } else {
        // everything worked fine // req.body has text fields, req.file has the file 
        // TODO replace promise with try catch ?
        const objectParams = { Bucket: process.env.AWS_BUCKET_NAME, Key: req.file.originalname, Body: req.file.buffer};
        
        // TODO if upload doesn't work on one of these, revert both
        // TODO move these to functions in upload file?
        // RDS insert
        if (req.body['description'] && req.file.mimetype && req.file.size) {
          console.log('Request received');
          dbClient.connect(function(err) {
            dbClient.query(`INSERT INTO main.uploads (description, type, size) VALUES ('${req.body['description']}', '${req.file.mimetype}', '${req.file.size}')`, function(error, result, fields) {
                  if (error) {
                    res.status(400).send(err);
                    console.log('error in insert')
                    return
                  }
                  if (result) {
                      console.log("succeded")
                    console.log(result)
                    // TODO send response
                    //res.send({description: req.file.originalname, type: req.file.mimetype, size: req.file.size});
                  }
                  if (fields) console.log(fields);
              });
          });
      } else {
          console.log('Missing a parameter');
          res.status(400).send('missing a parameter')
          return;
      }
  
        // S3 upload
        const uploadPromise = new AWS.S3({ apiVersion: '2006-03-01' }).putObject(objectParams).promise();
        uploadPromise.then((data) => {
          console.log("Successfully uploaded data to " + process.env.AWS_BUCKET_NAME + "/" + req.file.originalname);
        }).catch((error) => {
          console.error(error, error.stack);
        });
        res.status(200).send('File uploaded');
      }
    // })
  }

}