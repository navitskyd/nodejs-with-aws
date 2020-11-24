'use strict'
const { aws_bucket } = require('./vars');
const AWS = require("aws-sdk");

AWS.config.getCredentials(function (err) {
    if (err) console.log(err.stack);
    else {
      console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
  });
  
const bucket = new AWS.S3({params: {Bucket: aws_bucket}});

module.exports.bucket= bucket;