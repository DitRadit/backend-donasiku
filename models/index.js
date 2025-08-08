const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Area = require('./areaModel')(sequelize, Sequelize.DataTypes);
const User = require('./userModel')(sequelize, Sequelize.DataTypes);
const Item = require('./itemModel')(sequelize, Sequelize.DataTypes);
const Request = require('./requestsModel')(sequelize, Sequelize.DataTypes);
const Donation = require('./donationModel')(sequelize, Sequelize.DataTypes);
const DonationOffer = require('./donationOfferModel')(sequelize, Sequelize.DataTypes);
const Document = require('./documentsModel')(sequelize, Sequelize.DataTypes);

/* ====== Associations ====== */

// Area - Users
Area.hasMany(User, { foreignKey: 'area_id' });
User.belongsTo(Area, { foreignKey: 'area_id' });

// Area - Items
Area.hasMany(Item, { foreignKey: 'area_id' });
Item.belongsTo(Area, { foreignKey: 'area_id' });

// Users - Items
User.hasMany(Item, { foreignKey: 'user_id' });
Item.belongsTo(User, { foreignKey: 'user_id' });

// Users - Requests
User.hasMany(Request, { foreignKey: 'user_id' });
Request.belongsTo(User, { foreignKey: 'user_id' });

// Users - Documents
User.hasMany(Document, { foreignKey: 'user_id' });
Document.belongsTo(User, { foreignKey: 'user_id' });

// Items - Donations
Item.hasMany(Donation, { foreignKey: 'item_id' });
Donation.belongsTo(Item, { foreignKey: 'item_id' });

// Donations - Users (donor, receiver)
User.hasMany(Donation, { foreignKey: 'donor_id', as: 'Donated' });
User.hasMany(Donation, { foreignKey: 'receiver_id', as: 'Received' });
Donation.belongsTo(User, { foreignKey: 'donor_id', as: 'DonorUser' });
Donation.belongsTo(User, { foreignKey: 'receiver_id', as: 'ReceiverUser' });

// Requests - DonationOffers
Request.hasMany(DonationOffer, { foreignKey: 'request_id' });
DonationOffer.belongsTo(Request, { foreignKey: 'request_id' });

// Items - DonationOffers
Item.hasMany(DonationOffer, { foreignKey: 'item_id' });
DonationOffer.belongsTo(Item, { foreignKey: 'item_id' });

// Users (donor) - DonationOffers
User.hasMany(DonationOffer, { foreignKey: 'donor_id' });
DonationOffer.belongsTo(User, { foreignKey: 'donor_id' });


// Export
module.exports = {
  sequelize,
  Sequelize,
  Area,
  User,
  Item,
  Request,
  Donation,
  DonationOffer,
  Document
};
