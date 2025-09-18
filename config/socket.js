const { Server } = require('socket.io');
const { db } = require('./firebase');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" } 
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    socket.on('joinRoom', (roomId) => {
      if (!roomId) {
        console.error("joinRoom: roomId tidak ada");
        return;
      }
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on('sendMessage', async ({ roomId, message, senderId }) => {
      if (!roomId || !senderId || !message) {
        console.error("sendMessage: data tidak lengkap");
        return;
      }

      const timestamp = Date.now();

      try {
        const msgRef = db.ref(`messages/${roomId}`).push();
        await msgRef.set({ senderId, message, timestamp });

        io.to(roomId).emit('receiveMessage', { roomId, senderId, message, timestamp });
        console.log(`Message saved & broadcast to room ${roomId}`);
      } catch (err) {
        console.error("sendMessage error:", err);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  console.log("Socket.IO initialized successfully");
};

module.exports = { initSocket };
