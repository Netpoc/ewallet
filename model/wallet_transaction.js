const {Schema, model} = require("mongoose");

const walletTransactionSchema = Schema(
    {
        amount: {type: Number, default: 0},

        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        isInFlow: { type: Boolean},
        paymentMethod: { type: String, default: "flutterwave"},

        currency: {
            type: String,
            required: [true, "currency is required"],
            enum: ["NGN", "USD", "EUR", "GBP"],
        },
        
        status: {
            type: String,
            required: [true, "Payment is required"],
            enum: ["successful", "pending", "failed"],
        },
    },
    { timestamps: true}
);

module.exports = model("walletTransaction", walletTransactionSchema);