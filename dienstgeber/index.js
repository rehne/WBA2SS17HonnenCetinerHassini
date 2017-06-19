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
  res.send('Hello World!');
});

app.get('/user', function(req, res){

});

app.listen(settings.port, function(){
  console.log("Dienstgeber läuft auf Port " + settings.port + ".");
});
