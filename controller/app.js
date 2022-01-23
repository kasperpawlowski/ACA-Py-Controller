const express = require('express');
const bodyParser = require('body-parser')
const connectionsRoute = require('./routes/connections');
const indexRoute = require('./routes/index');

const app = express();
app.use('/topic', bodyParser.json(), connectionsRoute);
app.use('/', indexRoute);

module.exports = app;
