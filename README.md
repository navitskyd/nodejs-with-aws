
### Description
Fullstack Angular/NodeJs app with 80% test coverage. The user can upload a JPEG/PNG with a description which will be sent to the backend via API call. The backend will then take the image information and store it in a MySQL AWS RDS instance and store the image itself in an S3 bucket. To be used in conjunction with https://github.com/KazToozs/ImageDrive-Search.

**Demo here**: https://youtu.be/248aGh1D_Tw

### Dependencies
- A **AWS RDS** instance with MySQL database to upload to
- A **AWS S3** bucket to upload to, a second one for tests is preferable
- A **AWS Credentials** file setup to read from

##### Of note
- Run and tested on **MySQL  8.0.22**
- Coded in a **Windows 10** environment.

### Installation and execution

Make sure you have a .env file at the root of **backend-upload** folder.
Set **DB_DB=main** to facilitate usage.
A .env.example file is provided.
It should be filled out with your app, RDS and S3 resource details like so:
```
# MySQL setup, either test or an AWS RDS
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_USER=user
DB_PASSWORD=password
DB_PORT=3306
DB_DB=main

TEST_DB_HOST=localhost
TEST_DB_USER=root
TEST_DB_PASSWORD=password
TEST_DB_PORT=3306
TEST_DB=test

# AWS Bucket setup, it is better to have a seperate one for testing
AWS_BUCKET=your-bucket
TEST_AWS_BUCKET=your-test-bucket
AWS_REGION=eu-west-3

# Express server port to run on, environment to run in (test, dev...),
# http request origin (for cors)
APP_PORT=8080
TEST_APP_PORT=8080
NODE_ENV=dev
ORIGIN=http://localhost:4200
```
##### WARNING
**Set the NODE_ENV to "test" when running integration/unit tests**
Otherwise tests will be performed on the default environment and may tamper data.
```
NODE_ENV=test
```
Next, move into the **upload-app** folder and run the following script which will, in order:
* Install depedencies for both projects
* Perform a clean of the RDS databse provided, then migrate and seed with dummy data for use in Q2
* Run the backend and frontend concurrently
```sh
$ cd ./upload-app
$ npm run fresh-start
```
If you need to run the apps without reperforming a migration, use the 'dev' script
```sh
$ cd ./upload-app
$ npm run dev
```
It can take a while for the apps to start up; wait for the message that Angular has compiled in the terminal as that is usually the last action to happen.

For tests, you can execute them seperately. For front-end:
```sh
$ cd ./upload-app
$ npm run test
```
or back-end:
```sh
$ cd ./backend-upload
$ npm run unit-tests
```
The Sonar settings I used (**sonar-project.properties**) were as follows
```
sonar.projectKey=test-crossover-backend-upload
sonar.projectName=test-crossover-backend-upload
sonar.projectVersion=1.0
sonar.language=js
sonar.sources=.
sonar.login={{login hash}}
sonar.host.url=http://localhost:9000

sonar.sourceEncoding=UTF-8
sonar.tests=test
sonar.exclusions=migrations\\*
sonar.test.inclusions=test\\**\\*
sonar.coverage.exclusions=migrations\\*,test\\**\\*,src\\**\\*.spec.js,src\\**\\*.mock.js,node_modules\\*,coverage\\lcov-report\\*,src\\**\\*.spec.ts,src\\**\\*.mock.ts
sonar.javascript.lcov.reportPaths=coverage\\lcov.info
sonar.testExecutionReportPaths=test-report.xml
```
