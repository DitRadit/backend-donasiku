module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('requests', {
    request_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING(50), allowNull: true },
    message: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    quantity: { type: DataTypes.INTEGER, allowNull: true },
    category: { type: DataTypes.STRING(100), allowNull: true }
  }, {
    tableName: 'requests',
    timestamps: false
  });

  return Request;
};
