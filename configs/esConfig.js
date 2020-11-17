'use strict'

const { Client } = require('elasticsearch');
const config = require('./config');
const client = new Client({ node: `https://${config.es_user}:${config.es_pass}@${config.es_host}:${config.es_port}`});
// TODO remove this if necessary
//const client = new Client({ node: `https://${config.es_host}:${config.es_port}`});

module.exports.esClient= client;