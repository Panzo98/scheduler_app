"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn("Users", "role_id", {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Roles",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
    await queryInterface.addColumn("Users", "company_id", {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Companies",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Users", "role_id");
    await queryInterface.removeColumn("Users", "company_id");
  },
};
