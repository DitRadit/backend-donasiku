module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define('donations', {
    donation_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    item_id: { type: DataTypes.INTEGER, allowNull: false },
    donor_id: { type: DataTypes.INTEGER, allowNull: false },
    receiver_id: { type: DataTypes.INTEGER, allowNull: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 }, 
    status: { 
      type: DataTypes.ENUM('pending','in_progress','shipped','completed','cancelled'), 
      allowNull: false,
      defaultValue: 'pending'
    },
    confirmed_by_receiver: { type: DataTypes.BOOLEAN, defaultValue: false },
    donation_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    address: { type: DataTypes.STRING, allowNull: false },
    area_id: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    tableName: 'donations',
    timestamps: false
  });

  return Donation;
};
