var express = require("express");
var passport = require("passport");
var router = express.Router();

var mainController = require("../controllers/mainController");

router.use(function (req, res, next) {
  if (req.user == null) {
    res.redirect("/");
  } else {
    res.locals.currentUser = req.user;
    next();
  }
});

router.get("/", mainController.index);
router.get("/settings", mainController.userSettings);

router.post("/post", mainController.makePost_post);
router.post("/post/:id/like", mainController.likePost_post);
router.post("/post/:id/comment", mainController.commentPost_post);
router.post("/comment/:id/like", mainController.likeComment_post);

module.exports = router;
