"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Object_Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Object_Contact.belongsTo(models.Object, {
        foreignKey: "object_id",
      });
    }
  }
  Object_Contact.init(
    {
      value: { type: DataTypes.STRING, allowNull: false },
      object_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Object_Contact",
    }
  );
  return Object_Contact;
};
