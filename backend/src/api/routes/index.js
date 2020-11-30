const express = require('express');
const multer = require('multer');
const controller = require("../controllers/controller");
const router = express.Router();

const upl = multer({ limits: { fileSize: 500000 } }).single('uploadFile')

router.route("/upload").post(upl, controller.upload);

module.exports = router;
