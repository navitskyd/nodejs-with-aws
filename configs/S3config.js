'use strict'
const config = require('./config');
const AWS = require("aws-sdk");

AWS.config.getCredentials(function (err) {
    if (err) console.log(err.stack);
    else {
      console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
  });
  
const bucket = new AWS.S3({params: {Bucket: config.bucket_name}});

module.exports.bucket= bucket;