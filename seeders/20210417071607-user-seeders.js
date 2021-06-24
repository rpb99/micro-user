"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "John Doe",
          profession: "Web Developer",
          role: "admin",
          email: "johndoe@gmail.com",
          password: await bcrypt.hash("123456", 10),
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: "Riki",
          profession: "Frontend Developer",
          role: "student",
          email: "riki@gmail.com",
          password: await bcrypt.hash("123456", 10),
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
