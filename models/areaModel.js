module.exports = (sequelize, DataTypes) => {
  const Area = sequelize.define('area', {
    area_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    area_name: { type: DataTypes.STRING(150), allowNull: false },
    province: { type: DataTypes.STRING(150), allowNull: true },
    latitude: { type: DataTypes.DECIMAL(10,7), allowNull: true },
    longitude: { type: DataTypes.DECIMAL(10,7), allowNull: true }
  }, {
    tableName: 'area',
    timestamps: false
  });

  return Area;
};
