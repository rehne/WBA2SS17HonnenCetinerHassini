var fs = require('fs');
var express = require('express');

var app = express();

const settings = {
  port: 3000
};

app.use(function(err, req, res, next){
  console.log(err.stack);
  res.end(err.status + ' ' + err.messages);
});

app.use(function(req, res, next){
  console.log('Time ' + Date.now() + ' | Request-Pfad: ' + req.path);
  next();
});

app.get('/', function(req, res){
  res.status(200).send('Hello World!');
});

// User Methoden
app.get('/user', function(req, res){
  fs.readFile('database.json', function(err, data){
    var user = JSON.parse(data);
    res.status(200).send(user.user);
  });
});
app.get('/user/:userID')
app.post('/user', function(req, res){
  fs.readFile('user.json', function(err, data){
    
  });
});

// Offer Methoden
app.get('/offers', function(req, res){
  fs.readFile('database.json', function(err, data){
    var offers = JSON.parse(data);
    res.status(200).send(offers.offers);
  });
});
app.post('/offers', function(req, res){

});

app.listen(settings.port, function(){
  console.log("Dienstgeber läuft auf Port " + settings.port + ".");
});
