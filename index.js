//App setup
require("dotenv").config();
require("./config/database").connect();
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLUTTERWAVE, process.env.FLUTTERWAVE_SECRET);
const path = require("path");
const Wallet = require("./model/wallet");
const User = require("./model/user");
const WalletTransaction = require("./model/wallet_transaction");
const Transaction = require("./model/transaction");
const axios = require("axios");
const express = require("express");

//Services
const userLogic = require("./services/userServices");




const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.use("/user", userLogic);

app.get("/pay", (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));

});


app.get("/bank", async (req, res) => {
    try {
        const payload = {
            "country": "NG"
        }
        const response = await flw.Bank.country(payload)
        res.send(response)
        console.log(response)
    } catch (error) {
        console.log(error)
    }
})

app.get("/respos", async (req, res) => {
    const { transaction_id } = req.query;

    const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;

    const response = await axios({
        url,
        method: "get",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `${process.env.FLUTTERWAVE_SECRET}`,
        },
    });
    console.log(response.data.data)

});

app.get("/response", async (req, res) => {
    const { transaction_id } = req.query;

    const url = `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`;
    const response = await axios({
        url,
        method: "get",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `${process.env.FLUTTERWAVE_SECRET}`,
        },
    });

    const { status, currency, id, amount, customer } = response.data.data;

    // check if transaction id already exist
    const transactionExist = await Transaction.findOne({ transactionId: id });

    if (transactionExist) {
        return res.status(409).send("Transaction Already Exist");
    }

    //check if customer exist in our database
    const user = await User.findOne({ email: customer.email });

    //check if user has a wallet, else create wallet
    const wallet = await validateUserWallet(customer.userId);

    //create wallet transaction
    await createWalletTransaction({userId: customer.userId}, status, currency, amount);

    //create transaction
    await createTransaction(user, id, status, currency, amount, customer);

    await updateWallet(user, amount);

    return res.status(200).json({
        response: "Wallet funded successfully",
        data: wallet,
    });
});

//Vallidating User Wallet
const validateUserWallet = async (userId) => {
    try {
        //check if user has a wallet, else create wallet
        const userWallet = await Wallet.findOne({ userId });

        //If user wallet doesn't exist, creat a now one
        if (!userWallet) {
            //create wallet
            const wallet = await Wallet.create({
                userId,
            });
            return wallet;
        }
        return userWallet;
    } catch (error) {
        console.log(error);
    }
};

//Create Wallet Transaction
const createWalletTransaction = async (userId, status, currency, amount) => {
    try {
        //Create wallet Transaction
        const walletTransaction = await WalletTransaction.create({
            amount,
            userId,
            isInFlow: true,
            currency,
            status,
        });
        return walletTransaction;
    } catch (error) {
        console.log(error);
    }
};

//Create Transaction
const createTransaction = async (
    userId,
    id,
    status,
    currency,
    amount,
    customer
) => {
    try {
        //create transaction
        const transaction = await Transaction.create({
            userId,
            transactionId: id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone_number,
            amount,
            currency,
            paymentStatus: status,
            paymentGateway: "flutterwave",
        });
        return transaction;
    } catch (error) {
        console.log(error);
    }
};

//Update wallet
const updateWallet = async (userId, amount) => {
    try {
        //Update wallet
        const wallet = await Wallet.findOneAndUpdate(
            { userId },
            { $inc: { balance: amount } },
            { new: true }
        );
        return wallet;

    } catch (error) {
        console.log(error);
    }
};

app.get("wallet/:userId/balance", async (req, res) => {
    try {
        const { userId } = req.params;

        const wallet = await Wallet.findOne({ userId });
        res.status(200).json(wallet.balance);
    } catch (err) {
        console.log(err);
    }
})
app.listen(port, () => {
    console.log(`Server is live on PORT: ${port}`);
})