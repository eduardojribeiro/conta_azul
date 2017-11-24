var express = require('express');
var db = require('../db/db');
var router = express.Router();

router.get('/', function (req, res) {
	sql = db.connect();
	query = "SELECT * FROM CARS";
	sql.run(query, function(result){
		res.json({result: result});
	});
});

router.get('/find', function (req, res) {
	sql = db.connect();
	query = "SELECT * FROM CARS WHERE COMBUSTIVEL LIKE '%lina%' ";
	sql.run(query, function(result){
		res.json({result: result});
	});
});

module.exports = router;