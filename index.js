//App setup
require("dotenv").config();
require("./config/database").connect();
const express = require("express");

const port = process.env.PORT;

const app = express();

app.use(express.json());

app.listen(port, () => {
    console.log(`Server is live on PORT: ${port}`);
})