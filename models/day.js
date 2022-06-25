"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Day extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Day.belongsTo(models.Object, {
        foreignKey: "object_id",
      });
      Day.hasMany(models.Working_Hour, {
        foreignKey: "day_id",
      });
    }
  }
  Day.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      working_day: { type: DataTypes.BOOLEAN, allowNull: false },
      object_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Day",
    }
  );
  return Day;
};
