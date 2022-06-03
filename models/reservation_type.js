"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reservation_Type extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reservation_Type.hasMany(models.Reservation, {
        foreignKey: "type_id",
      });
    }
  }
  Reservation_Type.init(
    {
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      duration: { type: DataTypes.TIME, allowNull: false },
    },
    {
      sequelize,
      modelName: "Reservation_Type",
    }
  );
  return Reservation_Type;
};
