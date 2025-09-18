module.exports = (sequelize, DataTypes) => {
  const Request = sequelize.define('requests', {
    request_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    item_id: { type: DataTypes.INTEGER, allowNull: true }, 
    status: { 
      type: DataTypes.ENUM("open", "fulfilled", "closed"), 
      allowNull: false,
      defaultValue: "open"
    },
    message: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    quantity: { type: DataTypes.INTEGER, allowNull: true },
    category_id: { type: DataTypes.INTEGER, allowNull: false },
    area_id: { type: DataTypes.INTEGER, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
  }, {
    tableName: 'requests',
    timestamps: false
  });

  return Request;
};
