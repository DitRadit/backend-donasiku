require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
    define: {
      underscored: true
    }
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL (XAMPP) successfully.');
  } catch (err) {
    console.error('Unable to connect to MySQL:', err);
  }
})();

module.exports = sequelize;