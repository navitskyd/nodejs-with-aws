const result = require('dotenv').config();
module.exports= {
  db_host: process.env.DB_HOST,
  db_user: process.env.DB_USER,
  db_password: process.env.DB_PASSWORD,
  db_port: process.env.DB_PORT,
  aws_bucket_name: process.env.AWS_BUCKET_NAME,
  es_host: process.env.ELASTICSEARCH_HOST,
  es_pass: process.env.ELASTICSEARCH_PASSWORD,
  es_port: process.env.ELASTICSEARCH_PORT,
  es_user:process.env.ELASTICSEARCH_USERNAME,
  es_index:process.env.ELASTICSEARCH_INDEX,
  es_type:process.env.ELASTICSEARCH_TYPE,
  aws_es_host: process.env.AWS_ELASTIC_HOST,
  aws_es_user: process.env.AWS_ELASTIC_USER,
  aws_es_pass: process.env.AWS_ELASTIC_PASSWORD,
  aws_region: process.env.AWS_REGION,
  app_port: process.env.APP_PORT
};

if (result.error) {
  console.log(result.error, "[Error Parsing env variables!]");
  throw result.error;
}
