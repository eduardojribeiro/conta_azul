var express = require('express');
var db = require('../db/db');
var router = express.Router();

router.get('/', function (req, res) {
	var sql = db.connect();
	var page = parseInt(req.query.page) || 0;
	var qtd = 5;
	var query = "SELECT * FROM CARS ORDER BY ID DESC LIMIT 5 OFFSET " + (page * qtd);
	sql.run(query, function(result){
		if (result.length > 0){
			sql.run("SELECT COUNT(*) as TOTAL FROM CARS", function (itens) {
				var total = itens[0].TOTAL / 5
				res.json({
					result: result,
					pages: total % 1 ? parseInt(total) + 1 : total
				});
				db.close()
			});
		}else{
			res.json({result: [], pages: 0});
		}
	});
});

router.get('/find', function (req, res) {
	var sql = db.connect();
	var keyword = req.query.keyword;
	if(keyword){
		var query = "SELECT * FROM CARS WHERE COMBUSTIVEL LIKE '%" + keyword + "%'"
		query += " OR MARCA LIKE '%" + keyword + "%' OR MODELO LIKE '%" + keyword + "%'"
		query += " OR VALOR LIKE '%" + keyword + "%'";
		sql.run(query, function(result){
			res.json({result: result});
		});
		db.close()
	}else{
		res.status(500).send({ error: "Nenhuma palavra chave foi informada!" })
	}
});

router.delete('/', function(req, res){
	var sql = db.connect();
	var id = req.body.id;
	var query = "DELETE FROM CARS WHERE ID = '" + id + "'";
	sql.run(query, function(result){
		res.json({result: result});
		db.close()
	});
});

router.put('/', function(req, res){
	var sql = db.connect();
	params = req.body;
	var query = "INSERT INTO CARS (combustivel, imagem, marca, modelo, placa, valor) ";
	query += " VALUES ('" + params.combustivel + "', '" + params.imagem + "', ' ";
	query += params.marca + "', '" + params.modelo + "', '" + params.placa + "', '" + params.valor + "') ";
	sql.run(query, function(result){
		res.json({result: result});
		db.close()
	});
});


module.exports = router;