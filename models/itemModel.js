module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('items', {
    item_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    name: { type: DataTypes.STRING(200), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    category: { type: DataTypes.STRING(100), allowNull: true },
    image: { type: DataTypes.STRING(255), allowNull: true },
    status: { type: DataTypes.STRING(50), allowNull: true },
    area_id: { type: DataTypes.INTEGER, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'items',
    timestamps: false
  });

  return Item;
};
