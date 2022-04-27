'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const accounts = require('./mongoose/account');

var app = express();

app.use(bodyParser.json());

// Set response headers.
app.all('*', async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

// POST: Create new account.
app.post('/api/accounts/create', async function (req, res) {
    let number = Math.floor(Math.random() * 900000);
    let balance = 0;
    if (req.body.type === 'current') {
        balance = 5000;
    }
    if (req.body.type === 'credit') {
        balance = 40000;
    }
    var newAccount = {
        uuid: req.body.uuid,
        type: req.body.type,
        currency: req.body.currency,
        balance: balance,
        number: number
    };

    const axios = require('axios');
    await axios
    .get('http://localhost:4200/api/anomaly-detection/account')
    .then((res, req) => {
        await accounts.create(newAccount, function (err) {
            if (err) {
                console.log(err);
                res.status(500).send(err);
                return;
            }
            console.log("Account was created.");
            res.status(200).send({'message': 'Done!'});
        });
    })
    .catch(error => {
        console.error(error);
        res.status(500).send(err);
    });
});

// POST: Get user accounts.
app.post('/api/accounts/get', async function (req, res) {
    accounts.find({'uuid': req.body.uuid}, function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send({'err': err});
            return;
        }
        console.log("User accounts have been gotten.")
        res.status(200).send(results);
    });
});

// POST: Account deposit action.
app.post('/api/accounts/deposit', async function (req, res) {
    accounts.find({'number': req.body.number}, function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send({'err': err});
            return;
        }
        if (results.length === 0) {
            console.log('Account not found.');
            res.status(500).send({'err': 'Account not found.'});
            return;
        }
        let amount = Number(results[0].balance) + Number(req.body.amount);
        accounts.findOneAndUpdate({'number': req.body.number}, {'balance': amount}, function (err, results) {
            if (err) {
                console.log(err);
                res.status(500).send({'err': err});
                return;
            }
            console.log("Funds were deposited into the account.")
            res.status(200).send(results);
        });
    });
});

// POST: Account withdrawal action.
app.post('/api/accounts/withdraw', function (req, res) {
    accounts.find({'number': req.body.number}, function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send({'err': err});
            return;
        }
        if (results.length === 0) {
            console.log('account not found');
            res.status(500).send({'err': 'account not found'});
            return;
        }
        let amount = Number(results[0].balance) - Number(req.body.amount);
        accounts.findOneAndUpdate({'number': req.body.number}, {'balance': amount}, function (err, results) {
            if (err) {
                console.log(err);
                res.status(500).send({'err': err});
                return;
            }
            console.log("Funds were withdrawn from account.")
            res.status(200).send(results);
        });
    });
});

// GET: Accounts decline action.
app.get('/api/accounts/drop', function (req, res) {
    accounts.collection.drop();
    console.log("Acounts table has been dropped.")
    res.status(200).send({'message': 'Done!'});
});

module.exports = app;
