'use strict';
require('dotenv').config({silent: true, path: `${__dirname}/.env.data`});
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const mongostore = require('connect-mongo')(session);
const request = require('request');

const config = require(`${__dirname}/config`)[process.env.NODE_ENV];

var app = express();

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    store: new mongostore({url: process.env.MONGO_URL}),
    resave: true,
    saveUninitialized: true,
    cookie: {
        cookieName: 'connect.sid',
        secret: process.env.SESSION_SECRET,
        httpOnly: false,
        secure: false,
        ephemeral: true
    }
}));

require('./routes/auth')(app);
require('./routes/user')(app, request, config.ports);
require('./routes/bills')(app, request, config.ports);
require('./routes/accounts')(app, request, config.ports);
require('./routes/transactions')(app, request, config.ports);
require('./routes/support')(app, request, config.ports);

console.log(`Running on ${process.env.BASE_PATH}:${process.env.PORT}, connecting to ${process.env.MONGO_URL}`)

mongoose.connect(process.env.MONGO_URL, function () {
    app.listen(process.env.PORT, function () {
        console.log('Innovate portal running on port: %d', process.env.PORT);
    });
});
