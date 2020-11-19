'use strict'

const AWS = require('aws-sdk');
const connectionClass = require('http-aws-es');
const elasticsearch = require('elasticsearch');
const config = require('./config');

// local testing config
// //const node = `https://${config.es_user}:${config.es_pass}@${config.es_host}:${config.es_port}`
// // AWS.config.credentials = credentials;
// // const client = new elasticsearch.Client({ node: node });

AWS.config.getCredentials(function (err) {
    if (err) {console.log(err.stack); throw(err);}
    else {
      console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
  });

const client = new elasticsearch.Client({  
    host: config.aws_es_host,
    log: 'error',
    connectionClass: connectionClass,
    amazonES: {
      credentials: AWS.config.credentials
    }
});

// const client = new Client({ host: config.aws_es_host });
module.exports.esClient= client;

