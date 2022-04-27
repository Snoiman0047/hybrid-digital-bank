'use strict';

const mongoose = require('mongoose');
require('dotenv').config({silent: true, path: `${__dirname}/.env`});

var server = require('./app');

console.log(`Running on ${process.env.BASE_PATH}:${process.env.PORT},\nconnecting to ${process.env.MONGO_URL}`)

mongoose.connect(process.env.MONGO_URL, function () {
    server.listen(process.env.PORT, function () {
        console.log('Server running on port: %d', process.env.PORT);
    });
});