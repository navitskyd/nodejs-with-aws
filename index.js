require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer')
const AWS = require("aws-sdk");
const cors = require('cors')
var mysql = require('mysql');

const app = express()

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

var con = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  port     : 3306
});

const bucketName = 'crossover-test-bucket-will2s'

AWS.config.getCredentials(function (err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log("Access key:", AWS.config.credentials.accessKeyId);
  }
});

// Multer single file parser
const upload = multer({ limits: { fileSize: 500000 } }).single('uploadFile')

app.post('/upload', upload, (req, res) => {
  // upload(req, res, function (err) {
    // check for error thrown by multer- file size etc
    // TODO check file types
    if (req.file === undefined) {
      //console.log(err)
      res.status(400).send("error occured")
    } else {
      // everything worked fine // req.body has text fields, req.file has the file 
      // TODO replace promise with try catch ?
      const objectParams = { Bucket: bucketName, Key: req.file.originalname, Body: req.file.buffer};
      
      // TODO if upload doesn't work on one of these, revert both
      // TODO move these to functions in upload file?
      // RDS insert
      if (req.body['description'] && req.file.mimetype && req.file.size) {
        console.log('Request received');
        con.connect(function(err) {
            con.query(`INSERT INTO main.uploads (description, type, size) VALUES ('${req.body['description']}', '${req.file.mimetype}', '${req.file.size}')`, function(err, result, fields) {
                if (err) {
                  res.status(400).send(err);
                  console.log('error in insert')
                  return
                }
                if (result) {
                  console.log(result)
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
        console.log("Successfully uploaded data to " + bucketName + "/" + req.file.originalname);
      }).catch((error) => {
        console.error(error, error.stack);
      });
      res.status(200).send('File uploaded');
    }
  // })
})


// TODO RDS Insert
// app.post('/users', (req, res) => {
//   if (req.query.username && req.query.email && req.query.age) {
//       console.log('Request received');
//       con.connect(function(err) {
//           con.query(`INSERT INTO main.users (username, email, age) VALUES ('${req.query.username}', '${req.query.email}', '${req.query.age}')`, function(err, result, fields) {
//               if (err) res.send(err);
//               if (result) res.send({username: req.query.username, email: req.query.email, age: req.query.age});
//               if (fields) console.log(fields);
//           });
//       });
//   } else {
//       console.log('Missing a parameter');
//   }
// });



// Create unique bucket name


app.listen(8080,
  () => console.log(`Server running on port 8080`))