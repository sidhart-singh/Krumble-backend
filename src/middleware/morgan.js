const morgan = require("morgan");

module.exports = (app) => {
  // logging middleware
  app.use(morgan("dev"));
};
