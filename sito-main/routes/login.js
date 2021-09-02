var express = require('express');
var router = express.Router();
var session = require('express-session');
var moment = require('moment');

router.get('/', function (req, res, next) {

  res.render('login');

});

const fs = require('fs');
let users;
fs.readFile('users.json', (err, data) => {
  // cos'è err data
  users = JSON.parse(data);
  if (err) throw err;
  console.log(users);
});

router.post('/', function (req, res, next) {

  let consentito = false

  for (let i = 0; i < users.length; i++) {

    if (req.body.username == users[i].utente &&
      req.body.pass == users[i].password) {
      consentito = true;
      ruolo = users[i].ruolo;
    }
  }

  if (consentito) {
    if (ruolo == "amministratore") {
      req.session.username = req.body.username
      res.redirect('admin');
    }
    else {
      req.session.username = req.body.username
      res.redirect('home');
    }

  }
  else { res.send('<h1> accesso negato </h1>'); };

});


module.exports = router;