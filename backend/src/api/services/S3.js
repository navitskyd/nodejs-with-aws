const s3config = require('../../config/S3Config');
const AWS = require("aws-sdk");
exports.uploadImageS3 = async (objectParams) => {

    AWS.config.getCredentials(function (err) {
        if (err) console.log(err.stack);
        else {
            console.log("Access key:", AWS.config.credentials.accessKeyId);
        }
    });

    let response = await new AWS.S3().listBuckets().promise();
    let buckets = response['Buckets'];
    // console.log(buckets);
    // console.log(s3config.bucket.config.params['Bucket']);

    if (!buckets.some((bucket) => bucket['Name'] === s3config.bucket.config.params['Bucket'])) {
        console.log('NO BUCKET WITH NAME ' + s3config.bucket.config.params['Bucket']);
    }

    return s3config.bucket.putObject(objectParams).promise();
}

