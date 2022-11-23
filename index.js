//App setup
require("dotenv").config();
require("./config/database").connect();
const express = require("express");

//Services
const userLogic = require("./services/userServices");

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use("/user", userLogic);

app.listen(port, () => {
    console.log(`Server is live on PORT: ${port}`);
})