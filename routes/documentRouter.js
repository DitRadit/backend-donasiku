const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const upload = require("../middleware/upload");
const documentController = require("../controller/documentController");

router.post("/upload/user", verifyToken(), upload.single("file"), documentController.uploadUserDocument);

router.post("/upload/community", verifyToken(), upload.single("file"), documentController.uploadCommunityDocument );

router.get("/my-documents", verifyToken(), documentController.getMyDocuments);

router.get("/documents/users", verifyToken(["admin"]), documentController.getUserDocuments);

router.get("/documents/communities", verifyToken(["admin"]), documentController.getCommunityDocuments);

router.get("/download/:id", verifyToken(), documentController.downloadDocument);

router.patch("/documents/:id/verify", verifyToken(["admin"]), documentController.verifyDocument);

module.exports = router;
