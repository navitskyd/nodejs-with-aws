const path = require('path');

// import .env variables
require('dotenv-safe').config({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.APP_PORT,
  origin: process.env.ORIGIN,
  dbConfig: {
    db_host: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_HOST : process.env.DB_HOST,
    db_user: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_USER : process.env.DB_USER,
    db_password: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_PASSWORD : process.env.DB_PASSWORD,
    db_port: process.env.NODE_ENV === 'test' ? process.env.TEST_DB_PORT : process.env.DB_PORT,
  },
  aws_bucket: process.env.NODE_ENV === 'test' ? process.env.TEST_AWS_BUCKET : process.env.AWS_BUCKET,
};
