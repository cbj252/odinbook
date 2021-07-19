var express = require('express');
var passport = require('passport');
var router = express.Router();

var userController = require("../controllers/userController");

router.use(function(req, res, next) {
  if (req.user == null) {
    res.redirect("/");
  } else {
  res.locals.currentUser = req.user;
  next();
  }
});

router.get("/:id", userController.user_get);

// Sends a friend request
router.post("/:id", userController.user_post);
router.post("/:id/accept", userController.friendAccept_post);
router.post("/:id/reject", userController.friendReject_post);

router.post("/:id/profilePic", userController.profilePic);

module.exports = router;