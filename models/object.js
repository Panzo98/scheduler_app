"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Object extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Object.belongsTo(models.Company, {
        foreignKey: "company_id",
      });
      Object.hasMany(models.Reservation, {
        foreignKey: "object_id",
      });
      Object.hasMany(models.Reservation_Type, {
        foreignKey: "object_id",
      });
      Object.hasMany(models.Working_Hour, {
        foreignKey: "object_id",
      });
      Object.hasMany(models.Non_Working_Day, {
        foreignKey: "object_id",
      });
    }
  }
  Object.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      company_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Object",
    }
  );
  return Object;
};
