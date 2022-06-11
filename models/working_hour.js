"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Working_Hour extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Working_Hour.belongsTo(models.Day, {
        foreignKey: "day_id",
      });
      Working_Hour.belongsTo(models.Object, {
        foreignKey: "object_id",
      });
    }
  }
  Working_Hour.init(
    {
      day_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      start: { type: DataTypes.TIME, allowNull: false },
      end: { type: DataTypes.TIME, allowNull: false },
      object_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Working_Hour",
    }
  );
  return Working_Hour;
};
