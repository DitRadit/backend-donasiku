module.exports = (sequelize, DataTypes) => {
  const Area = sequelize.define('area', {
    area_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    area_name: { type: DataTypes.STRING(150), allowNull: false },
  }, {
    tableName: 'area',
    timestamps: false
  });

  return Area;
};
