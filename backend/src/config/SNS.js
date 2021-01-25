'use strict'
const AWS = require("aws-sdk");

// let bucket

AWS.config.getCredentials(function (err) {
    if (err) console.log(err.stack);
    else {
        console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
});

// bucket = new AWS.S3({params: {Bucket: aws_bucket}});

const sns = new AWS.SNS({credentials: AWS.config.credentials, region: AWS.config.region});


module.exports.sns = sns;