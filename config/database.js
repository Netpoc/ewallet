//MongoDB Database Setup
const mongoose = require("mongoose");

const { DATABASE_URI } = process.env;

exports.connect = () => {
    //Connecting to the database
    mongoose
        .connect(DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(() => {
            console.log("Database connection successfull");
        })
        .catch((error) => {
            console.log("Connection to database failed.");
            console.error(error);
            process.exit(1);
        });
};