const express = require ("express");
const router = express.Router();

const userControls = require("../controllers/userController");

//Register a new user
router.post("/register", userControls.userRegister);

//User login
router.post("/login", userControls.userLogin);

//Get User
router.get("/getuser", userControls.getUser);

module.exports = router;