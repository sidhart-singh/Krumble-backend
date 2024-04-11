// const path = require("path");
const express = require("express");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./src/db");
const sessionStore = new SequelizeStore({ db });
const bodyParserMiddleware = require("./src/middleware/express-body-parser");
const loggingMiddleware = require("./src/middleware/morgan");
const sessionMiddleware = require("./src/middleware/passport");
const passport = require("passport");
const PORT = process.env.PORT || 19001;

const app = express();
module.exports = app;

// passport registration
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const createApp = () => {
  loggingMiddleware(app);

  bodyParserMiddleware(app);

  sessionMiddleware(app, session, sessionStore);

  // auth and api routes
  app.use("/auth", require("./src/routes/auth"));
  app.use("/api", require("./src/routes/api"));

  app.get("/", (req, res) => {
    res.send("working");
  });

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || "Internal server error.");
  });
};

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`));
};

const syncDb = () => db.sync();

async function bootApp() {
  await sessionStore.sync();
  await syncDb();
  await createApp();
  await startListening();
}
// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  bootApp();
} else {
  createApp();
}
