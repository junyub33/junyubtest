var static = require('node-static');
var http = require('http');
var path = require('path');
var express = require('express');
var app = module.exports = express();
var mysql = require('mysql');
var bodyparser = require('body-parser');
var ejs=require('ejs');
var logger = require('morgan');
var server = require('http').createServer(app);

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var FACEBOOK_APP_ID = '177329242711424';
var FACEBOOK_APP_SECRET = '78334e664a372ed0578af98c395535b3';
var routes = require('./routes/index');
var users = require('./routes/users');


console.log("junyub");
console.log("junyub!!!")

console.log("two");
console.log("yeongseok");
// var router = require('router')


// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   database : 'psychodrama'
// });

// connection.connect(function(err) {
//     if (err) {
//         console.error('mysql connection error');
//         console.error(err);
//         throw err;
//     }
// });

var file = new (static.Server)();




app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
// app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended:false})); //bodyparser 에 접근하기위해서



app.use('/users', users);


app.get('/', function(req, res){
  res.render('index.html');
});

app.get('/about', function(req, res) {
  res.render('about.html');
  
});

app.get('/start', function(req, res) {
  res.render('start.html');
  
});

app.get('/contact', function(req, res) {
  res.render('contact.html');
  
});

// app.get('/popup', function(req, res) {
//   res.render('popup');
  
// });

app.get('/login', function(req, res) {
  res.render('login.html');
});

app.get('/login1', function(req, res) {
  res.render('login1.html');  
  
});

app.get('/join', function(req, res) {
  //console.log(req);
  res.render('join.html');
  
});

app.post('/user', function (req, res){
  console.log(req);
  console.log('login OK');



  var user = {'id':req.body.id, 'name1':req.body.name1, 'password':req.body.password, 'year':req.body.year
,'mon':req.body.mon,'date':req.body.date,'gender':req.body.gender,'email1':req.body.email1,'email2':req.body.email2,
'tel1':req.body.tel1,'tel2':req.body.tel2,'tel3':req.body.tel3};
  var query = connection.query('insert into user set ?', user, function(err,result){
    if (err) {
            console.error(err);
            throw err;
        }
        res.render('join.html');
    });   
});


app.get('/user', function(req,res){
    var query = connection.query('select * from user',function (err,rows){
        console.log(rows);
        res.json(rows);
    });
    
});

app.post('/user/chk', function(req, res) {
  console.log('chk ok');
  var id = {'id':req.body.id};
  var query = connection.query('select id from user where id = ?', req.body.id, function (err, result) {
    if (err)  {
      console.error(err);
      throw err;
    }
    else {
      if(result[0] != null) {
        res.json({ "status" : 0 });
      }
      else {
        res.json({ "status" : 1 });
      }
    }
  });
});

app.post('/user/login', function(req, res) {
  console.log('login ok');
  var id = {'id':req.body.id, 'password':req.body.password};
  var query = connection.query('select id from user where id = ?', req.body.id, function (err, result) {
    if (err)  {
      console.error(err);
      throw err;
    }
    else {
      if(result[0] != null) {
        res.json({ "status" : 0 });
      }
      else {
        res.json({ "status" : 1 });
      }
    }
  });
});



app.get('/success', function(req, res, next) {
  res.render('success.html');

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



app.use(passport.initialize());
app.use(passport.session());
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


app.get('/test', function(req, res, next) {
  res.render('auth.html');
});


passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: '/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
  process.nextTick(function() {
    //Assuming user exists
    done(null, profile);
  });
}));

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/success',
  failureRedirect: '/error'
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});






server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));




});

  
