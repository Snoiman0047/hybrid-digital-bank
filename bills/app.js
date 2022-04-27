'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const bills = require('./mongoose/bill');

var app = express();

app.use(bodyParser.json());

// Set response headers.
app.all('*', async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

// POST: Create new bill.
app.post('/api/bills/create', async function (req, res) {
    var newBill = {
        uuid: req.body.uuid,
        category: req.body.category,
        entity: req.body.entity,
        account_no: req.body.account_no,
        amount: req.body.amount,
        date: req.body.date
    };
    bills.update({'category': req.body.category}, newBill, {upsert: true}, function (err) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
            return;
        }
        console.log("Bill was created.");
        res.status(200).send({'message': 'Done!'});
    });
});

// POST: Get user bills.
app.post('/api/bills/get', async function (req, res) {
    bills.find({'uuid': req.body.uuid}, function (err, results) {
        if (err) {
            console.log(err);
            res.status(500).send({'err': err});
            return;
        }
        console.log("User bills have been gotten.")
        res.status(200).send(results);
    });
});

// GET: Bills decline action.
app.get('/api/bills/drop', async function (req, res) {
    bills.collection.drop();
    console.log("Bills table has been dropped.")
    res.status(200).send({'message': 'Done!'});
});

module.exports = app;
