require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Donasiku API'));

const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ DB synced');

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to sync DB:', err);
  }
})();
