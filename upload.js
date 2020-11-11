const AWS = require('aws-sdk');

// TODO use this instead of current means of upload?
// The name of the bucket that you have created
const BUCKET_NAME = 'crossover-test-bucket-will2s';

export const uploadFile = (file, type, size) => {
// TODO check the content type/size is properly set
  // Setting up S3 upload parameters
  const params = {
      Bucket: BUCKET_NAME,
      Key: file.name, // File name you want to save as in S3
      Body: fileContent,
      ContentType: type,
      ContentLength: size
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
      if (err) {
          throw err;
      }
      console.log(`File uploaded successfully. ${data.Location}`);
  });
};
