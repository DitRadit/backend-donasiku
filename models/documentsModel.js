module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('documents', {
    document_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(200), allowNull: true },
    file_url: { type: DataTypes.STRING(255), allowNull: false },
    status: { type: DataTypes.STRING(50), allowNull: true },
    uploaded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'documents',
    timestamps: false
  });

  return Document;
};
