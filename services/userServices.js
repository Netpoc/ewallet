const express = require ("express");
const router = express.Router();

const userControls = require("../controllers/userController");

//Register a new user
router.post("/register", userControls.userRegister);

module.exports = router;