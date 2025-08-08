// models/donation.model.js
module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define('donations', {
    donation_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    item_id: { type: DataTypes.INTEGER, allowNull: false },
    donor_id: { type: DataTypes.INTEGER, allowNull: false },
    receiver_id: { type: DataTypes.INTEGER, allowNull: true },
    status: { type: DataTypes.STRING(50), allowNull: true },
    confirmed_by_receiver: { type: DataTypes.BOOLEAN, defaultValue: false },
    donation_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'donations',
    timestamps: false
  });

  return Donation;
};
