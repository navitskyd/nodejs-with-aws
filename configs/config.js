const result = require('dotenv').config();
module.exports= {
  db_host: process.env.DB_HOST,
  db_user: process.env.DB_USER,
  db_password: process.env.DB_PASSWORD,
  db_port: process.env.DB_PORT,
  bucket_name: process.env.AWS_BUCKET_NAME,
  es_host: process.env.ELASTICSEARCH_HOST,
  es_pass: process.env.ELASTICSEARCH_PASSWORD,
  es_port: process.env.ELASTICSEARCH_PORT,
  es_user:process.env.ELASTICSEARCH_USERNAME,
  es_index:process.env.ELASTICSEARCH_INDEX,
  es_type:process.env.ELASTICSEARCH_TYPE,
  app_port: process.env.APP_PORT
};

// TODO setup with AWS ES
  // https://stackoverflow.com/questions/48273935/how-to-access-aws-elasticsearch-from-node-js
//   var elasticClient = new elasticsearch.Client({  
//     host: ***,
//     log: 'error',
//     connectionClass: connectionClass,
//     amazonES: {
//       credentials: new AWS.EnvironmentCredentials('AWS')
//     }
// });

if (result.error) {
  console.log(result.error, "[Error Parsing env variables!]");
  throw result.error;
}
