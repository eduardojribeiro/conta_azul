var db = {};
var sqlite = require('sqlite-sync'); 

db.connect = function(){
	sqlite.connect('db/contaazul.db');
	return sqlite;
};

db.close = function(){
	sqlite.close();
};

db.connect();

sql = "CREATE TABLE CARS(";
sql += "ID INTEGER PRIMARY KEY AUTOINCREMENT,";
sql += " COMBUSTIVEL TEXT NOT NULL,";
sql += " IMAGEM TEXT NOT NULL,";
sql += " MARCA TEXT NOT NULL,";
sql += " MODELO TEXT NOT NULL,";
sql += " PLACA TEXT NOT NULL,";
sql += " VALOR INTEGER NOT NULL";
sql += ");";

var populate = function(){
	sqlite.insert("CARS", {
		COMBUSTIVEL : "Flex",
		IMAGEM : null,
		MARCA : "Volkswagem",
		MODELO : "Gol",
		PLACA : "FFF-5498",
		VALOR : 20000
	});
	sqlite.insert("CARS", {
		COMBUSTIVEL : "Gasolina",
		IMAGEM : null,
		MARCA : "Volkswagem",
		MODELO : "Fox",
		PLACA : "FOX-4125",
		VALOR : 20000
	});
	sqlite.insert("CARS", {
		COMBUSTIVEL : "Alcool",
		IMAGEM : "http://carros.ig.com.br/fotos/2010/290_193/Fusca2_290_193.jpg",
		MARCA : "Volkswagen",
		MODELO : "Fusca",
		PLACA : "PAI-4121",
		VALOR : 20000
	});
};

sqlite.run(sql,function(res){
	if(!res.error)
		populate()
	else
		console.log(res.error);
});

db.close();

module.exports = db;