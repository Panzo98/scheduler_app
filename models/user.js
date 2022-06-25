"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, {
        foreignKey: "role_id",
      });
      User.belongsTo(models.Company, {
        foreignKey: "company_id",
      });
    }
  }
  User.init(
    {
      username: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false },
      avatar_url: { type: DataTypes.STRING },
      role_id: { type: DataTypes.INTEGER, allowNull: false },
      company_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
