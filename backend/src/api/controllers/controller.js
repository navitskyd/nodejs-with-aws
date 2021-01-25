const DbDriver = require('../../config/dbConfig');
const DbDao = require('../services/database');
const {uploadImageS3} = require('../services/S3');
const {sns} = require('../../config/SNS');

exports.upload = async (req, res, next) => {

    if (req.file === undefined) {
        res.status(400).send('File is undefined');
        return;
    }
    if (!req.body['description'] || !req.file.mimetype || !req.file.size) {
        res.status(400).send('Missing a parameter');
        return;
    }

    const db = new DbDriver()
    const dbDao = new DbDao(db)
    const objectParams = {
        Key: req.file.originalname,
        Body: req.file.buffer
    };
    try {
        await db.connect()
        await db.connection.beginTransactionPromise()
        await dbDao.create({name: req.file.originalname, description: req.body['description'], type: req.file.mimetype, size: req.file.size});
        await uploadImageS3(objectParams);
        await db.connection.commitPromise();
        res.status(201).send()
        db.disconnect()
    } catch (err) {
        await db.connection.rollbackPromise;
        res.status(500).send('Failed upload')
        db.disconnect()
    }

}

exports.subscribe = async (req, res, next) => {
    let email = req.body['email'];
    if (!email) {
        res.status(400).send('Email is not defined!');
    }

    let params = {
        Protocol: 'EMAIL',
        TopicArn: 'arn:aws:sns:eu-west-2:668312079829:new-image',
        Endpoint: email
    };

    sns.subscribe(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            res.send(data);
        }
    });


}

exports.unsubscribe = async (req, res, next) => {
    let email = req.body['email'];
    if (!email) {
        res.status(400).send('Email is not defined!');
    }

    let params = {
        TopicArn: 'arn:aws:sns:eu-west-2:668312079829:new-image'
    };

    sns.listSubscriptionsByTopic(params).promise()
        .then((data) => {
            console.log(data)
        })
        .catch((err) => {
            console.error(err, err.stack);
        });

    //unsubscribe
    params = {
        SubscriptionArn: 'EMAIL'
    };

    sns.unsubscribe(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            res.send(data);
        }
    });


}

