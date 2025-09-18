module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('items', {
    item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    category_id: { type: DataTypes.INTEGER, allowNull: false },
    image: { type: DataTypes.STRING(255), allowNull: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }, 
    status: { type: DataTypes.STRING(50), allowNull: true },
    area_id: { type: DataTypes.INTEGER, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    request_id: { type: DataTypes.INTEGER, allowNull: true },
  }, {
    tableName: 'items',
    timestamps: false
  });

  return Item;
};
