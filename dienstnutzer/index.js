var http = require('http');
var express = require('express');
var request = require('request');
var app = express();

var dHost = 'http://localhost';
var dPort = 3000;
var dUrl = dHost + ':' + dPort;

app.get('/users', function(req, res){
  var url = dUrl + '/users';

  request(url, function(err, response, body){
    body = JSON.parse(body);
    res.json(body);
  });
});

app.listen(3001, function(){
  console.log('Dienstnutzer läuft auf Port 3001.');
});
