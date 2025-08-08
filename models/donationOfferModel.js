module.exports = (sequelize, DataTypes) => {
  const DonationOffer = sequelize.define('donation_offers', {
    offer_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    request_id: { type: DataTypes.INTEGER, allowNull: true },
    item_id: { type: DataTypes.INTEGER, allowNull: true },
    donor_id: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING(50), allowNull: true },
    offer_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'donation_offers',
    timestamps: false
  });

  return DonationOffer;
};
