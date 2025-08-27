const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const verifyToken = require('../middleware/auth');

router.get('/profile', verifyToken(), userController.getProfile);
router.get("/all", verifyToken(["admin"]), userController.getAllUsers);

module.exports = router;
