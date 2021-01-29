const s3config = require('../../config/S3Config');
const AWS = require("aws-sdk");
exports.uploadImageS3 = async (objectParams) => {

  AWS.config.getCredentials(function (err) {
    if (err) console.log(err.stack);
    else {
      console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
  });

  let buckets = new AWS.S3().list();
  console.log(buckets);

  return s3config.bucket.putObject(objectParams).promise();
}

