const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const chatController = require('../controller/chatController');

router.post('/room/:targetUserId', verifyToken(), chatController.createRoom);

router.get('/rooms', verifyToken(), chatController.getUserRooms);

router.get('/room/:roomId', verifyToken(), chatController.getRoomMessages);


module.exports = router;
