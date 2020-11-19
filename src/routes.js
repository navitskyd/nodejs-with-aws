const express    = require("express");
const controller = require("./controller");
const multer = require('multer');
const routes = express.Router();

const upl = multer({ limits: { fileSize: 500000 } }).single('uploadFile')

routes.route("/search").get(controller.search);
routes.route("/upload").post(upl, controller.upload);

module.exports = routes;