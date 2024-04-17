const Sequelize = require("sequelize");
const db = require("../db");

const Crum = db.define("crum", {
  category: {
    type: Sequelize.STRING,
  },
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  imageUrl: {
    type: Sequelize.STRING,
  },
  image: {
    type: Sequelize.BLOB("long"),
  },
  imageType: {
    type: Sequelize.TEXT,
  },
  imageName: {
    type: Sequelize.TEXT,
  },
});

// Crum.addHook("beforeValidate", (Crum, options) => {
//   Crum.imageUrl = `/assets/Crums/${Crum.name}.png`;
// });

module.exports = Crum;
