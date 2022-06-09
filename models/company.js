"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Company.hasMany(models.Object, {
        foreignKey: "company_id",
      });
      Company.belongsTo(models.User, {
        foreignKey: "company_id",
      });
    }
  }
  Company.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Company",
    }
  );
  return Company;
};
