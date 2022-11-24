const axios = require("axios");
const express = require ("express");
const router = express.Router();

const userControls = require("../controllers/userController");

//Register a new user
router.post("/register", userControls.userRegister);

//User login
router.post("/login", userControls.userLogin);

router.get("/response", async (req, res) => {
    const {transaction_id} = req.query;

    const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;

    const response = await axios({
        url,
        method: "get",
        hearders: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `${process.env.FLUTTERWAVE_SECRET}`,
        },
    });
    console.log(response.data.data)
})

module.exports = router;