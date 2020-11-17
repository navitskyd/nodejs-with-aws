const esconfig = require('../configs/esConfig');
const client = esconfig.esClient;
const config = require('../configs/config');
const esIndex = config.es_index;
const esb = require('elastic-builder'); //the builder

module.exports = {

  async search(offset, min, max, description, fileType) {
    const requestBody = esb.requestBodySearch()
        .from(offset)
        .size(20)
        .query(
            esb.boolQuery()
            .must([
                esb.matchQuery(
                    'description', description
                ),
                esb.rangeQuery('size').gte(min).lte(max)
            ])
            .filter(esb.termQuery('type', fileType))
        )
        return client.search({index: esIndex, body: requestBody.toJSON()});
  },

  async upload() {

  }

    // async fetchMatchMultipleQuery(origin, name,weight){
    // const requestBody = esb.requestBodySearch()
    //     .query(esb.boolQuery().must([esb.matchQuery('Origin', origin,),(esb.matchQuery('Name', name,)),])
    //         .filter(esb.rangeQuery('Weight_in_lbs').gte(weight))
    //     )
    //     return client.search({index: esIndex, body: requestBody.toJSON()});
    // },

// async fetchMatchMultipleQuery(origin, name,weight){
    // const requestBody = esb.requestBodySearch()
    //     .query(
    //         esb.boolQuery()
    //         .must([
    //             esb.matchQuery(
    //             'Origin', origin,
    //             ),
    //             (
    //             esb.matchQuery(
    //                 'Name', name,
    //             )
    //             ),
    //         ])
    //         .filter(esb.rangeQuery('Weight_in_lbs').gte(weight))
    //     )
    //     return client.search({index: esIndex, body: requestBody.toJSON()});
    // },

// Old ES client request structure
/*
var esClient = elasticsearch.Client({
    host: 'localhost:9200'
  });

  esClient.search({
    from: offset,
    size: 20,
    index: 'images',
    type: 'image',
    body: {
      query: {
        bool: {
            must: [
                  {
                          match: {
                          description: {
                              query: description
                          }
                      }
                  },
                  {
                          range: {
                          size: { from: min, to: max }
                      }
                  }
              ],
              filter: {
                  term: {type: fileType}
              }
          }
      
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

};