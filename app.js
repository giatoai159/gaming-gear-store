const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

require('dotenv').config();

const exphbs  = require('express-handlebars');
const helpers = require('./views/helpers/index');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// Router
const storeIndexRouter = require('./components/index/index');
const storeProductsRouter = require('./components/products/productRouter');
const accountRouter = require('./components/account/accountRouter');
// Database
const db = require('./models');
db.sequelize.sync();

// Views
app.engine('hbs', exphbs({
  defaultLayout: 'store',
  extname: 'hbs',
  layoutsDir: 'views/layouts',
  partialsDir: 'views/partials',
  helpers
}));

// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Sessions
app.use(session({secret: process.env.SESSION_SECRET}));
// Routes
app.use('/', storeIndexRouter);
app.use('/products', storeProductsRouter);
app.use('/account', accountRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
