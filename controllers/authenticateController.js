const passport = require("passport");
const bcrypt = require("bcrypt");

const User = require("../models/user");

exports.index = function (req, res) {
  if (req.user) {
    res.redirect("/main");
  } else {
    res.render("authIndex");
  }
};

exports.signUp_get = function (req, res) {
  res.render("authSignUp");
};

exports.signUp_post = function (req, res, next) {
  bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
    if (err) {
      return next(err);
    } else {
      const user = new User({
        username: req.body.username,
        password: hashedPassword,
        display_name: req.body.display_name,
      }).save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  });
};

// Note this is NOT a function! This is apparently because passport is middleware?
exports.login_post = passport.authenticate("local", {
  successRedirect: "/main",
  failureRedirect: "/",
});

exports.logout = function (req, res) {
  req.logout();
  res.redirect("/");
};

exports.homePage = function (req, res) {
  res.render("homePage");
};
