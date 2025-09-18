module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define("categories", {
    category_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: "categories",
    timestamps: false
  });

  return Category;
};
