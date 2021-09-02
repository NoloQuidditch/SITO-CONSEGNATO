
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var flash = require('express-flash');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var homeRouter = require('./routes/home');
var storicoRouter = require('./routes/storico');
var adminRouter = require('./routes/admin');
var ordineRouter = require('./routes/ordine');

var bodyParser = require('body-parser');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookie: { maxAge: 3600000 },
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}))


app.use(flash());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/home', homeRouter);
app.use('/storico', storicoRouter);
app.use('/admin', adminRouter);
app.use('/ordine', ordineRouter);

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(err);
  console.log(err.message);
  console.log(err.status);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
