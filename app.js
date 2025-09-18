require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { sequelize } = require('./models');
const { testConnection } = require('./config/firebase');
const { initSocket } = require('./config/socket');

const authRoutes = require('./routes/authRouter');
const userRoutes = require('./routes/userRouter');
const documentRoutes = require('./routes/documentRouter');
const communityRouter = require('./routes/communityRouter');
const chatRouter = require('./routes/chatRouter');
const areaRouter = require('./routes/areaRouter');
const donationRouter = require('./routes/donationRouter');
const categoryRouter = require('./routes/categoryRouter');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Donasiku API'));
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/documents', documentRoutes);
app.use('/chat', chatRouter);
app.use('/community', communityRouter);
app.use('/area', areaRouter);
app.use('/donate', donationRouter);
app.use('/category', categoryRouter);

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('DB synced');

    await testConnection();

    server.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to sync DB:', err);
  }
})();
