const esconfig = require('./configs/esConfig');
const client = esconfig.esClient;
const config = require('./configs/config');
const s3config = require('./configs/S3config');
const AWS = require("aws-sdk");

module.exports = {
  // Adapt search query based on provided parameters, using defaults where parameters missing
  async search(offset, min, max, description, fileType) {
    if (isNaN(offset) || offset < 0) {
      offset = 0;
    }
    if (isNaN(min) || offset < 0) {
      min = 0;
    }
    if (isNaN(max) || offset < 0) {
      max = 500000
    }
    let request = {
      from: offset,
      size: 20,
      index: config.es_index,
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  size: {
                    from: min,
                    to: max
                  }
                }
              }
            ],
          }

        }
      }
    }

    if (description && description !== 'undefined') {
      request.body.query.bool.must.unshift({
        match: { 
          description: { 
            query: description // value: description || query: description
          }
        }
      })
    }
    if (fileType && fileType !== 'undefined') {
      console.log('wut: '+ fileType)
      request.body.query.bool = {
        ...request.body.query.bool,
        filter: {
          term: {
            type: fileType
          }
        }
      }
    }

    console.log(request)
    return client.search(request);
  },

  async uploadImageS3(objectParams) {
    // TODO replace old API call?
    return s3config.bucket.putObject(objectParams).promise();
  },

};