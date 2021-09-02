var express = require('express');
var router = express.Router();
var session = require('express-session');
var moment = require('moment');
const puppeteer = require('puppeteer');


const fs = require('fs');


router.get('/', function (req, res, next) {

    console.log(req.query);

    let data = fs.readFileSync(req.query.utente + '.json');

    let ordini = JSON.parse(data);

    let found = ordini.find(o => o.dataeora == req.query.dataeora);

    res.render('ordine', { order: found });

});

router.get('/pdf', async function (req, res, next) {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log(req.headers.host);
    await page.goto("http://" + req.headers.host + '/ordine?utente=' + req.query.utente + "&dataeora=" + req.query.dataeora, {
        waitUntil: 'networkidle2',
    });
    await page.pdf({ path: 'fatturaNoloQuidditch.pdf', format: 'a4' });

    await browser.close();
    res.download("./fatturaNoloQuidditch.pdf", function (err) {
        fs.unlinkSync("./fatturaNoloQuidditch.pdf");
    });
});

module.exports = router;