const DbDriver = require('../../config/dbConfig');
const DbDao = require('../services/database')
const { uploadImageS3 } = require('../services/S3')
 
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
    await dbDao.create({description: req.body['description'], type: req.file.mimetype, size: req.file.size});
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