const s3config = require('../../config/S3Config');

exports.uploadImageS3 = async (objectParams) => {
  return s3config.bucket.putObject(objectParams).promise();
}

