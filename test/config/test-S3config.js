// 'use strict'
// const { aws_bucket, aws_region } = require('../../src/config/vars');
// const AWS = require("aws-sdk");
// const { S3Client, CreateBucketCommand } = require("@aws-sdk/client-s3");

// AWS.config.getCredentials(function (err) {
//     if (err) console.log(err.stack);
//     else {
//       console.log("Access key:", AWS.config.credentials.accessKeyId);
//     }
//   });
  
// const bucket = new AWS.S3({params: {Bucket: aws_bucket}});

// module.exports.bucket= bucket;



/* eslint-env mocha */
const { aws_bucket, aws_region } = require('../../src/config/vars');
const AWSMock = require('mock-aws-s3');

exports.useInTest = function () {
    before(async function connectToTestS3() {

      // Set the AWS region
      const REGION = aws_region; //e.g. "us-east-1"
      // Set the bucket parameters
      const bucketParams = { Bucket: aws_bucket };
      // Create S3 service object
      const s3 = new AWSMock.S3(REGION);
      //Attempt to create the bucket
        try {
          await s3.createBucket(bucketParams);
          console.log("Successfully created bucket " + aws_bucket);
        } catch (err) {
          console.log("Error in bucket creation", err);
        }
      this.s3 = s3
    })
    beforeEach(async function dropTestS3() {
      try {
        console.log(`Deleting contents...`);
        // We can't delete a bucket before emptying its contents
        const { Contents } = await this.s3.listObjects({ Bucket: aws_bucket }).promise();
        if (Contents.length > 0) {
          await this.s3
            .deleteObjects({
              Bucket: aws_bucket,
              Delete: {
                Objects: Contents.map(({ Key }) => ({ Key }))
              }
            })
            .promise();
        }
        return true;
      } catch (err) {
        return false;
      }
    })
    after(async function disconnectTestS3() {
      try {
        console.log(`Deleting contents...`);
        // We can't delete a bucket before emptying its contents
        const { Contents } = await this.s3.listObjects({ Bucket: aws_bucket }).promise();
        if (Contents.length > 0) {
          await this.s3
            .deleteObjects({
              Bucket: aws_bucket,
              Delete: {
                Objects: Contents.map(({ Key }) => ({ Key }))
              }
            })
            .promise();
        }
        let ret = await this.s3.deleteBucket({ Bucket: aws_bucket }).promise();
        console.log("Bucket deletion: " + ret)
        return true;
      } catch (err) {
        return false;
      }
      
    })
}

