'use strict'
const { aws_bucket, env } = require('./vars');
const AWS = require("aws-sdk");
const AWSMock = require('mock-aws-s3');

let bucket
if (env === 'test') {
  AWSMock.config.basePath = '/tmp/buckets/' // Can configure a basePath for your local buckets
  bucket = AWSMock.S3({
      params: { Bucket: aws_bucket }
  });
} else {
  AWS.config.getCredentials(function (err) {
    if (err) console.log(err.stack);
    else {
      console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
  });

  bucket = new AWS.S3({params: {Bucket: aws_bucket}});
}


module.exports.bucket= bucket;