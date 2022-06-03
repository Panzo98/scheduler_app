"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Non_Working_Day extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Non_Working_Day.init(
    {
      date: { type: DataTypes.DATEONLY, allowNull: false, unique: true },
      reason: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Non_Working_Day",
    }
  );
  return Non_Working_Day;
};
