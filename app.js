var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var pool = require('./routes/pool');
var routes = require('./routes/index');
var users = require('./routes/users');
var home=require('./routes/home');
var session=require('client-sessions');
var app = express();
app.use(session({

  cookieName: 'session',
  secret: 'cmpe273_test_string',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,  }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public/')));

app.use('/', routes);
app.get('/login',home.login);
app.post('/afterSignIn',home.afterSignIn);
app.get('/getAllUsers',home.getAllUsers);
app.get('/signup',home.signup);
app.use('/add_username',home.add_username);
app.use('/add_details',home.add_details);
app.use('/setup_profile',home.setup_profile);
app.post('/insertTweet',home.insert_tweet);
app.use('/displayProfile',home.displayProfile);
app.get('/homepage',home.redirectToHomepage);
app.get('/adding_username',home.adding_username);
app.get('/settingup_profile',home.settingup_profile);
app.use('/gotohome',home.gotohome);
/*app.post('/suggestedusers',home.suggestedusers);*/
app.use('/insertFollowers',home.insertFollowers);
app.post('/logout',home.logout);
app.post('/justtodisplayprofile',home.justtodisplayprofile);
app.get('/profileforperson',home.profileforperson);
app.get('/profileforrperson',home.getFeed);
app.post('/justtoinfo',home.justtoinfo);
app.post('/save',home.save);
app.post('/search',home.search);
app.post('/retweet',home.retweet);

/*app.use('/profileperson',home.profileperson);*/
app.get('/getFeed',home.getFeed);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
var data = fs.readFileSync('../public/config/pool.conf', 'utf-8');
if(data!=null && typeof data !='undefined'){
  var lines = data.split("\n");
  pool.createPool(lines[0], lines[1])
}
else{
  pool.createPool(100, 400)
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
