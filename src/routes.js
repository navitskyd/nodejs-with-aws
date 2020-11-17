const express    = require("express");
const controller = require("./controller");
const multer = require('multer');
const routes = express.Router();

const upload = multer({ limits: { fileSize: 500000 } }).single('uploadFile')

routes.route("/search").get(controller.search);
routes.route("/upload").post(upload, controller.upload);

module.exports = routes;