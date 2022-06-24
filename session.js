const session = require("express-session");

const setUpSessionStore = function (app) {
  // set up session store
  app.use(
    session({
      secret: "yo this is my secret",
      resave: false, // don't save session if unmodified
      saveUninitialized: false, // don't create session until something stored
    })
  );
};

module.exports = setUpSessionStore;
