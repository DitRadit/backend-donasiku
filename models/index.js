const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const Area = require('./areaModel')(sequelize, Sequelize.DataTypes);
const User = require('./userModel')(sequelize, Sequelize.DataTypes);
const Item = require('./itemModel')(sequelize, Sequelize.DataTypes);
const Request = require('./requestsModel')(sequelize, Sequelize.DataTypes);
const Donation = require('./donationModel')(sequelize, Sequelize.DataTypes);
const Document = require('./documentsModel')(sequelize, Sequelize.DataTypes);
const Community = require('./communityModel')(sequelize, Sequelize.DataTypes);
const Category = require('./categoryModel')(sequelize, Sequelize.DataTypes);

/* ====== Associations ====== */

// Area - Users
Area.hasMany(User, { foreignKey: 'area_id' });
User.belongsTo(Area, { foreignKey: 'area_id' });

// Area - Items
Area.hasMany(Item, { foreignKey: 'area_id' });
Item.belongsTo(Area, { foreignKey: 'area_id' });

// Users - Items
User.hasMany(Item, { foreignKey: "user_id" });
Item.belongsTo(User, { foreignKey: "user_id" });

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
User.hasMany(Donation, { foreignKey: 'donor_id', as: 'DonorDonations' });
User.hasMany(Donation, { foreignKey: 'receiver_id', as: 'ReceiverDonations' });
Donation.belongsTo(User, { foreignKey: 'donor_id', as: 'Donor' });
Donation.belongsTo(User, { foreignKey: 'receiver_id', as: 'Receiver' });

// Area - Communities
Area.hasMany(Community, { foreignKey: 'area_id' });
Community.belongsTo(Area, { foreignKey: 'area_id' });

User.hasMany(Community, { foreignKey: 'user_id' });
Community.belongsTo(User, { foreignKey: 'user_id' });

// Community - Documents
Community.hasMany(Document, { foreignKey: 'community_id' });
Document.belongsTo(Community, { foreignKey: 'community_id' });

Category.hasMany(Item, { foreignKey: "category_id" });
Item.belongsTo(Category, { foreignKey: "category_id" });

Category.hasMany(Request, { foreignKey: "category_id" });
Request.belongsTo(Category, { foreignKey: "category_id" });

Area.hasMany(Request, { foreignKey: "area_id" });
Request.belongsTo(Area, { foreignKey: "area_id" });

Request.hasMany(Item, { foreignKey: "request_id" });
Item.belongsTo(Request, { foreignKey: "request_id" });

Area.hasMany(Request, { foreignKey: "area_id" });
Request.belongsTo(Area, { foreignKey: "area_id" });

Area.hasMany(Donation, { foreignKey: "area_id" });
Donation.belongsTo(Area, { foreignKey: "area_id" });

// Export
module.exports = {
  sequelize,
  Sequelize,
  Area,
  User,
  Item,
  Request,
  Donation,
  Document,
  Community,
  Category
};
