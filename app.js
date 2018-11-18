var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const amqpConn = require('./rabbitmq');

mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true}).then(
  () => { 
    console.log('conected...');
    amqpConn.init();    
  },
  err => { 
    console.log(err);

  }
);
mongoose.Promise = global.Promise

mongoose.connection.on('open', function() {
  console.log("Connected to Mongoose...");
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// support parsing of application/json type post data
//app.use(bodyParser.json());
//support parsing of application/x-www-form-urlencoded post data
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

console.log('connection => '+process.env.MONGODB_URI);

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

process
  .on('SIGTERM', shutdown('SIGTERM'))
  .on('SIGINT', shutdown('SIGINT'))
  .on('uncaughtException', shutdown('uncaughtException'));

function shutdown(signal) {
  return (err) => {
    mongoose.connection.close();
    amqpConn.closeChannel();
    amqpConn.closeConn();
    process.exit(err ? 1 : 0);

  };
}

module.exports = app;
