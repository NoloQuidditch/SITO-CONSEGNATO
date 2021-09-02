var express = require('express');
var router = express.Router();
var session = require('express-session');
var moment = require('moment');

const fs = require('fs');

router.get('/', function (req, res, next) {

	let data = fs.readFileSync('ITEMS.json');

	let items = JSON.parse(data);

	res.render('admin', { items: items });

});

router.post('/', function (req, res, next) {
	console.log(req.body);

	let data = fs.readFileSync("ITEMS.json");
	let prodotti = JSON.parse(data);

	let nextId = 1;
	if (prodotti.length > 0) {
		nextId = nextId + prodotti[prodotti.length - 1].ID;
	}

	let found = prodotti.find(element => element.ID == req.body.id);
	if (found == undefined) {
		found = {}

		found.ID = nextId;
		found.nome = req.body.nome;
		found.descrizione = req.body.descrizione;
		found.numero = parseInt(req.body.numero);
		found.prezzo = parseFloat(req.body.prezzo);
		found.stato = "disponibile";
		prodotti.push(found);
	}

	else {
		found.nome = req.body.nome;
		found.descrizione = req.body.descrizione;
		found.numero = parseInt(req.body.numero);
		found.prezzo = parseFloat(req.body.prezzo);
		found.stato = req.body.stato;
	}

	fs.writeFileSync("ITEMS.json", JSON.stringify(prodotti, undefined, 1));
	res.redirect("admin");
});


router.post('/eliminaitem', function (req, res, next) {
	console.log(req.body);
	let users = JSON.parse(fs.readFileSync('users.json'));

	for (let i = 0; i < users.length; i++) {
		try {
			let ordini = JSON.parse(fs.readFileSync(users[i].utente + '.json'));
			for (let i = 0; i < ordini.length; i++) {
				console.log(ordini[i].prodotti);
				for (let j = 0; j < ordini[i].prodotti.length; j++) {
					console.log(ordini[i].prodotti[j]);
					if (ordini[i].prodotti[j].id == req.body.id) {
						res.send("<script>alert('Non è possibile eliminare il prodotto'); location.href='/admin';</script>");
						console.log('NON ELIMINA');
					}
				}
			}
		}

		catch (err) {
			if (err.code === 'ENOENT') {
				console.log('File not found!');
			} else {
				throw err;
			}
		};
	}
	let data = fs.readFileSync("ITEMS.json");
	let prodotti = JSON.parse(data);
	prodotti = prodotti.filter(p => p.ID != req.body.id);
	fs.writeFileSync("ITEMS.json", JSON.stringify(prodotti, undefined, 1));
	res.send("<script>alert('Prodotto eliminato'); location.href='/admin';</script>");
	console.log('ELIMINA');
	res.redirect('/admin');

});

module.exports = router;