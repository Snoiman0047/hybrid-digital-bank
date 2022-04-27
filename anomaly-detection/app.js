'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const anomaly_detection = require('./moongose/anomaly_detection');

var app = express();

app.use(bodyParser.json());

// Set response headers.
app.all('*', async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

// GET: Get permission to create an account.
app.get('/api/anomaly-detection/account', async function (req, res) {
    if (await getActionPermission('Account')) {
        res.status(200).send('Permission gotten.')
    }
    else res.status(500).send('Permission was not gotten.')
})

// GET: Get permission to create an transaction.
app.get('/api/anomaly-detection/transaction', async function (req, res) {
    if (await getActionPermission('Transaction')) {
        res.status(200).send('Permission gotten.')
    }
    else res.status(500).send('Permission was not gotten.')
})

// Get action permission. 
async function getActionPermission(activity) {
    const axios = require('axios');
    let permission
    await axios
    .get('http://free.tinyfunction.com/call/h13a7?data=')
    .then((res, req) => {
            anomaly_detection.create({uuid: null, type_of_activity: activity, permission: res.data}, async function (err) {
                if (err) {
                    console.log(err);
                    return;
                }
                console.log("Anomaly detection doc was created.");
            })
        permission = res.data
    })
    .catch(error => {
        console.error(error);
    });
    return permission
}

module.exports = app;
