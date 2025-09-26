module.exports = (sequelize, DataTypes) => {
  const DonationLog = sequelize.define("DonationLog", {
    log_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    donation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    old_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    new_status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    note: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: "donation_logs",
    timestamps: true,
  });

  return DonationLog;
};
