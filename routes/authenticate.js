var express = require('express');
var passport = require('passport');
var router = express.Router();

var authenticateController = require("../controllers/authenticateController");

router.get("/", authenticateController.index);
router.get("/signUp", authenticateController.signUp_get);
router.post("/signUp", authenticateController.signUp_post);
router.post("/login", authenticateController.login_post);
router.get("/logout", authenticateController.logout);

module.exports = router;