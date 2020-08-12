var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



//Database
var mongoose=require('mongoose');
var Users=require('./models/users');
const url='mongodb://localhost:27017/associationUserData';
var connect=mongoose.connect(url);

connect.then((db)=>{
  console.log("Server connected successfully");
},(err)=>{
  console.log(err);
});  

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('assets', path.join(__dirname, 'assets'));

app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

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
  console.log(err.message);
  if(err.message==='Upload Images only'){
    res.render('homePage',{msg:err});
  }else{
    alert(err.message);
  }
  
});

module.exports = app;
