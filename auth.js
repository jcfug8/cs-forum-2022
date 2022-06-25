// init passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { User } = require("./model");

const setUpAuth = function (app) {
  passport.use(
    new LocalStrategy(function (username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (user.password != password) {
          return done(null, false);
        }
        return done(null, user);
      });
    })
  );

  // init passport
  app.use(passport.initialize());
  // tell passort to use express-session store
  app.use(passport.authenticate("session"));

  // user serialization
  passport.serializeUser(function (user, cb) {
    cb(null, { id: user._id, username: user.username });
  });

  // user deserialization
  passport.deserializeUser(function (user, cb) {
    return cb(null, user);
  });

  // auth routes
  // creating a auth session
  app.post("/session", passport.authenticate("local"), function (req, res) {
    res.status(201).json({ message: "successfully created session" });
  });

  // get if currently logged in
  app.get("/session", function (req, res) {
    if (!req.user) {
      res.status(401).json({ mesage: "unauthenticated" });
      return;
    }
    res.status(200).json({ message: "authenticated" });
  });
};

module.exports = setUpAuth;
