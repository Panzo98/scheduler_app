"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Working_Hours", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      day_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      working_day: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      start: {
        type: Sequelize.TIME,
      },
      end: {
        type: Sequelize.TIME,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Working_Hours");
  },
};
