const s3config = require('../../config/S3Config');
const AWS = require("aws-sdk");
exports.uploadImageS3 = async (objectParams) => {

    AWS.config.getCredentials((err) => {
        if (err) console.log(err.stack);
        else {
            console.log("Access key:", AWS.config.credentials.accessKeyId);
        }
    });

    let s3 = new AWS.S3();
    let response = await s3.listBuckets().promise();
    let buckets = response['Buckets'];

    if (!buckets.some((bucket) => bucket['Name'] === s3config.bucket.config.params['Bucket'])) {
        console.log('NO BUCKET WITH NAME ' + s3config.bucket.config.params['Bucket']);
        s3.createBucket({Bucket: s3config.bucket.config.params['Bucket']}, (err, data) => {
            if (err) {
                console.log(err);
            } else {
                params = {Bucket: s3config.bucket.config.params['Bucket']};
                console.log(params);
                console.log("bucket created! ?>>>");
            }
        });
    }

    return s3config.bucket.putObject(objectParams).promise();
}

