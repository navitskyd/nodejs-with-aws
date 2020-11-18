const esconfig = require('../configs/esConfig');
const client = esconfig.esClient;
const config = require('../configs/config');
const esb = require('elastic-builder'); //the builder
const dbconfig = require('../configs/dbConfig');
const dbClient = dbconfig.dbClient;
const AWS = require("aws-sdk");

module.exports = {

  async search(offset, min, max, description, fileType) {
    // const requestBody = esb.requestBodySearch()
    //     .from(offset)
    //     .size(20)
    //     .query(
    //         esb.boolQuery()
    //         .must([
    //             esb.matchQuery(
    //                 'description', description
    //             ),
    //             esb.rangeQuery('size').gte(min).lte(max)
    //         ])
    //         .filter(esb.termQuery('type', fileType))
    //     )
    // let esbRequestBody = esb.requestBodySearch()
    //     .from(offset)
    //     .size(20)
    //     .query(
    //         esb.boolQuery()
    //         .must([
    //             esb.rangeQuery('size').gte(min).lte(max)
    //         ])
    //     )

    // console.log(esbRequestBody)
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
      type: config.es_type,
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

    if (description) {
      request.body.query.bool.must.unshift({
        match: {
          description: {
            query: description
          }
        }
      })
    }
    if (fileType) {
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

  async uploadImageRDS(req) {
    return dbClient.connect(() => {
      dbClient.query(`INSERT INTO main.uploads (description, type, size) ` +
        `VALUES ('${req.body['description']}', '${req.file.mimetype}', '${req.file.size}')`);
    });
  },

  async uploadImageS3(objectParams) {
    // TODO replace old API call?
    return new AWS.S3({
      apiVersion: '2006-03-01'
    }).putObject(objectParams).promise();
  },

  async deleteImageS3(objectParams) {
    // TODO replace old API call?
    return new AWS.S3({
      apiVersion: '2006-03-01'
    }).deleteObject(objectParams).promise();
  }
};

/*

  client.search({
    from: offset,
    size: 20,
    index: 'images',
    type: 'image',
    body: {
      query: {
            match: {
              description: {
                query: description
              }
            },
      }
    }
  }).then(function(response) {
    var hits = response.hits.hits;
    console.log(hits)
    res.status(200).send(hits)
  }).catch(function (error) {
    console.trace(error.message);
  });

*/