module.exports = (sequelize, DataTypes) => {
  const Community = sequelize.define('communities', {
    community_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false }, 
    name: { type: DataTypes.STRING(150), allowNull: false },
    short_desc: { type: DataTypes.STRING(255), allowNull: true },
    full_desc: { type: DataTypes.TEXT, allowNull: true },
    type: {
      type: DataTypes.ENUM('Komunitas','Panti Asuhan','Panti Jompo'),
      allowNull: false,
      defaultValue: 'Komunitas'
    },
    location_url: { type: DataTypes.STRING(255), allowNull: true }, 
    area_id: { type: DataTypes.INTEGER, allowNull: true },
    location_text: { type: DataTypes.STRING(255), allowNull: true }, 
    founder_name: { type: DataTypes.STRING(150), allowNull: true },
    phone: { type: DataTypes.STRING(30), allowNull: true },
    members_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    profile_url: { type: DataTypes.STRING(255), allowNull: true }
  }, {
    tableName: 'communities',
    timestamps: false
  });

  return Community;
};
