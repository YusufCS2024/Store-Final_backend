var express = require('express');
var router = express.Router();
const {
  loginController,
  currentUser,
  logout,
} = require("../controllers/login");

/* GET users listing. */
router.post('/login', loginController);
router.get("/current-user", currentUser);
router.post("/logout", logout);




module.exports = router;
