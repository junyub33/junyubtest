var static = require('node-static');
var http = require('http');
var path = require('path');
var express = require('express');

var file = new(static.Server)();

var app = module.exports = express();
var server = require('http').createServer(app);

app.set('port', (process.env.PORT || 5000));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.render('index.html');
});

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});