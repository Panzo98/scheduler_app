"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Reservation.belongsTo(models.Reservation_Type, {
        foreignKey: "type_id",
      });
    }
  }
  Reservation.init(
    {
      name: DataTypes.STRING,
      date: { type: DataTypes.DATE, allowNull: false },
      type_id: { type: DataTypes.INTEGER, allowNull: false },
      phone_number: DataTypes.STRING,
      message: DataTypes.STRING,
      admin_note: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Reservation",
    }
  );
  return Reservation;
};
