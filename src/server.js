// Dependencies
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const esconfig = require('../configs/esConfig');
let helmet = require("helmet");
const app = express()
app.use(helmet.hidePoweredBy());

// Config loading
const router  = require("./routes")
const esClient = esconfig.esClient;

// Server setup
app.use(cors());
app.use("/", router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Test ES cluster
esClient.ping({}, function(error) {
  if (error) {
      console.log('ES Cluster is down', error);
  } else {
      console.log('ES Cluster is up!');
  }
});

// Run server
app.set('port', process.env.APP_PORT || 8080);

app.listen(app.get('port'), () => {
    console.log(`Express server listening on port, ${app.get('port')}`)
  })
