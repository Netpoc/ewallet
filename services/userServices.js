const axios = require("axios");
const { json } = require("body-parser");
const { response } = require("express");
const express = require ("express");
const router = express.Router();

const userControls = require("../controllers/userController");

//Register a new user
router.post("/register", userControls.userRegister);

//User login
router.post("/login", userControls.userLogin);

router.post("/ussd", async(req, res)=> {
    const data = [{
                    "clientId": "hTKp0duy",
                    "appId": "dev1029",
                    "sessionId": "8a444af8-4b03-4545-8677-2a6c924bdddb",
                    "msisdn": "2341234512345",
                    "operator": "mtn",
                    "input": {
                            "type": "Dial",
                            "shortcodeString": "*425*023#"
                            }
                    }]
    const url = "https://c48c-154-160-14-196.eu.ngrok.io/ussd"
    const response = await axios({
        url,
        data,
        method: "post"
    })
    console.log(response)
})

module.exports = router;