const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/upload');
const documentController = require("../controller/documentController");

router.post("/upload", verifyToken(), upload.single("file"), documentController.uploadDocument);

router.get("/documents", verifyToken(), documentController.getDocuments);

module.exports = router;
