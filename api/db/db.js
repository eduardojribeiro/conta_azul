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
sql += "id INTEGER PRIMARY KEY AUTOINCREMENT,";
sql += " combustivel TEXT NOT NULL,";
sql += " imagem TEXT NOT NULL,";
sql += " marca TEXT NOT NULL,";
sql += " modelo TEXT NOT NULL,";
sql += " placa TEXT NOT NULL,";
sql += " valor INTEGER NOT NULL";
sql += ");";

var populate = function(){
	sqlite.insert("CARS", {
		combustivel : "Flex",
		imagem : null,
		marca : "Volkswagem",
		modelo : "Gol",
		placa : "FFF-5498",
		valor : 20000
	});
	sqlite.insert("CARS", {
		combustivel : "Gasolina",
		imagem : null,
		marca : "Volkswagem",
		modelo : "Fox",
		placa : "FOX-4125",
		valor : 20000
	});
	sqlite.insert("CARS", {
		combustivel : "Alcool",
		imagem : "http://carros.ig.com.br/fotos/2010/290_193/Fusca2_290_193.jpg",
		marca : "Volkswagen",
		modelo : "Fusca",
		placa : "PAI-4121",
		valor : 20000
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