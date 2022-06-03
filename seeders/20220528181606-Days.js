"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    await queryInterface.bulkInsert("Days", [
      {
        name: "Monday",
        working_day: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Tuesday",
        working_day: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Wednesday",
        working_day: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Thursday",
        working_day: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Friday",
        working_day: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Saturday",
        working_day: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sunday",
        working_day: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Days", null, {});
  },
};
