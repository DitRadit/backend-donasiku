const { User } = require('../models'); 
const { db } = require('../config/firebase');

const generateRoomId = (user1, user2) => {
  return user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
};

exports.createRoom = async (req, res) => {
  try {
    const currentUserId = req.user.user_id;
    const targetUserId = parseInt(req.params.targetUserId, 10);

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You cannot chat with yourself" });
    }
    const currentUser = await User.findByPk(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }

    const targetUser = await User.findByPk(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "Target user not found" });
    }

    const roomId = generateRoomId(currentUserId, targetUserId);
    const roomRef = db.ref(`rooms/${roomId}`);
    const snapshot = await roomRef.once("value");

    if (!snapshot.exists()) {
      await roomRef.set({
        users: {
          [currentUserId]: { name: currentUser.name }, 
          [targetUserId]: { name: targetUser.name }    
        },
        createdAt: Date.now()
      });

      await db.ref(`userRooms/${currentUserId}/${roomId}`).set(true);
      await db.ref(`userRooms/${targetUserId}/${roomId}`).set(true);
    }

    const messagesSnap = await db.ref(`messages/${roomId}`).once("value");
    const messages = messagesSnap.exists() ? Object.values(messagesSnap.val()) : [];

    return res.json({
      roomId,
      users: { [currentUserId]: true, [targetUserId]: true },
      messages
    });
  } catch (err) {
    console.error(" createRoom error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


exports.getUserRooms = async (req, res) => {
  try {
    const currentUserId = req.user.user_id;

    const userRoomsSnap = await db.ref(`userRooms/${currentUserId}`).once("value");
    if (!userRoomsSnap.exists()) {
      return res.json([]);
    }

    const roomIds = Object.keys(userRoomsSnap.val());

    const rooms = [];
    for (const roomId of roomIds) {
      const roomSnap = await db.ref(`rooms/${roomId}`).once("value");
      if (roomSnap.exists()) {
        rooms.push({ roomId, ...roomSnap.val() });
      }
    }

    return res.json(rooms);
  } catch (err) {
    console.error("getUserRooms error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messagesSnap = await db.ref(`messages/${roomId}`).once("value");
    const messages = messagesSnap.exists() ? Object.values(messagesSnap.val()) : [];

    return res.json(messages);
  } catch (err) {
    console.error("getRoomMessages error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

