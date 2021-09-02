var express = require('express');
var router = express.Router();
var session = require('express-session');
var moment = require('moment');

const fs = require('fs');

router.get('/',function(req, res, next){
	console.log(req.session.username);

 	let users = JSON.parse(fs.readFileSync('users.json'));
 
	let ordiniUtente = [];

	let ruolo;

	for (let i = 0; i < users.length; i++){
	 	if( users[i].utente== req.session.username){
			ruolo = users[i].ruolo
		}
	}


 	if (ruolo == 'amministratore'){
 		for (let i = 0; i < users.length; i++){
 			try {
					let ordini = JSON.parse(fs.readFileSync(users[i].utente + '.json'));
		 			 for (let i = 0; i < ordini.length; i++){
						ordiniUtente.push(ordini[i]);
				} 
			}  
     
 		   catch (err){
        if (err.code === 'ENOENT'){
            console.log('File not found!');
            //ok array vuoto
        } else {
            throw err;
       			 }
    		};	
    	for (let i = 0; i < users.length; i++){

    	}
	 		}
	 	
	 	} else{

	 	try {
   		 ordiniUtente = JSON.parse(fs.readFileSync(req.session.username + '.json'));
 		   } catch (err){
        if (err.code === 'ENOENT'){
            console.log('File not found!');
            //ok array vuoto
        } else {
            throw err;
       			 }
    		};	
	 	}
    res.render('storico', {orders: ordiniUtente, ruolo: ruolo});
});

router.post('/',function(req, res, next){

	let data = fs.readFileSync(req.body.utente + '.json');
    let ordini = JSON.parse(data);
	let dati = fs.readFileSync("ITEMS.json");
    let prodotti = JSON.parse(dati);
    let found = ordini.find(ordine => ordine.dataeora == req.body.dataeora);
    found.stato = req.body.stato;
	for (let i = 0; i < found.prodotti.length; i++){
    	let trovato = prodotti.find( p=> p.ID == found.prodotti[i].id);
    	trovato.numero = parseInt(trovato.numero) + parseInt(found.prodotti[i].quantita);
    }
    fs.writeFileSync(req.body.utente + '.json', JSON.stringify(ordini, undefined, 1));
    fs.writeFileSync("ITEMS.json", JSON.stringify(prodotti, undefined, 1));
	res.redirect('storico');
});
module.exports = router;