var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser')
var global = require('./global');
var db = require('./db/db');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

var cars = require('./routes/cars');
app.use('/api/', cars)

app.listen(3000, function () {
  console.log('Listening on port 3000!');
});
