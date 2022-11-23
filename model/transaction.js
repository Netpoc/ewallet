const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"user",
        },
        transactionId: {
            type: Number,
            trim: true,
        },
        name: {
            type: String,
            required: [true, "name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "email is required"],
            trim: true,
        },
        phone: {
            type: String,
        },
        amount: {
            type: Number,
            required: [true, "amount is require"],
        },
        currency: {
            type: String,
            enum: ["NGN","USD","EUR", "GBP"],
            required: [true, "Currncy is required"],            
        },
        paymentStatus: {
            type: String,
            enum: ["successfull","pending","failed"],
            default: "pending",
        },
        paymentGateway: {
            type: String,
            required: [true, "payment gateway is required"],
            enum: ["flutterwave"],
        },
    },
    {
        timestamps: true
    }
)