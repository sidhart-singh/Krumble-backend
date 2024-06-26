const Sequelize = require("sequelize");
const pg = require("pg");
require("dotenv").config();

const db = new Sequelize(process.env.DB_URL, {
  dialect: "postgres",
  dialectModule: pg,
  dialectOptions: {
    ssl: {
      require: true,
    },
  },
});
module.exports = db;
