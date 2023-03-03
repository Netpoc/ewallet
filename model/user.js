//User Data Model Setup
const {Schema, model} = require("mongoose");

const userSchema = Schema(
    {
    first_name: {type: String, default: null},
    last_name: {type: String, default: null},
    email: {type: String, unique: true},
    password: {type: String},
    wallet: {type: Schema.Types.ObjectId, ref: 'wallet'}
}, 
{timeStamp: true});

module.exports = model("User", userSchema);