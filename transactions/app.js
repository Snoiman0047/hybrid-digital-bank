'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const transactions = require('./mongoose/transaction');

var app = express();

app.use(bodyParser.json());

// Set response headers.
app.all('*', async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

// POST: Create new transaction.
app.post('/api/transactions/create', async function (req, res) {
    var newTransaction = {
        uuid: req.body.uuid,
        amount: req.body.amount,
        currency: req.body.currency,
        description: req.body.description,
        date: req.body.date,
        category: req.body.category
    };

    const axios = require('axios');
    await axios
    .get('http://localhost:4200/api/anomaly-detection/account')
    .then((res, req) => {
        await transactions.create(newTransaction, function (err) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
                return;
            }
            console.log("Transaction was created");
            res.status(200).send({'message': 'Done!'});
        });
    })
    .catch(error => {
        console.error(error);
        res.status(500).send(err);
    });


});

// POST: Get user transactions.
app.post('/api/transactions/get', async function (req, res) {
    transactions.find({'uuid': req.body.uuid}, function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send({'err': err});
            return;
        }
        //console.log('Fetched ', results);
        console.log("User bills have been gotten.")
        res.status(200).send(results);
    });
});

// GET: Transactions decline action.
app.get('/api/transactions/drop', async function (req, res) {
    transactions.collection.drop();
    console.log("Transactions table has been dropped.")
    res.status(200).send({'message': 'Done!'});
});

module.exports = app;
