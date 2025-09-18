module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(100), allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM('donor','receiver','admin'), allowNull: false, defaultValue: 'donor' },
    name: { type: DataTypes.STRING(150), allowNull: true },
    email: { type: DataTypes.STRING(150), allowNull: false},
    phone: { type: DataTypes.STRING(30), allowNull: true },
    address: { type: DataTypes.TEXT, allowNull: true },
    verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    area_id: { type: DataTypes.INTEGER, allowNull: true },
    profile_url: { type: DataTypes.STRING(255), allowNull: true }
  }, {
    tableName: 'users',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['username'] },
      { unique: true, fields: ['email'] }
    ]
  });

  return User;
};
