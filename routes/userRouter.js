const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const verifyToken = require('../middleware/auth');
const upload = require("../middleware/upload");

router.get('/profile', verifyToken(), userController.getProfile);
router.get("/all", verifyToken(["admin"]), userController.getAllUsers);
router.put("/profile", verifyToken(), upload.single("file"), userController.updateProfile);

module.exports = router;
