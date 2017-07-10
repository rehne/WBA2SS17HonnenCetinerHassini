var http = require('http');
var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');

var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDX3b5xS8GIcn3SlA2Pfpvl0-S5Fnqh8BM'
});

var dHost = 'http://localhost';
var dPort = 3000;
var dUrl = dHost + ':' + dPort;

//GET /users
app.get('/users', function(req, res){
  var url = dUrl + '/users';

  // helper method, only for get requests
  request(url, function(err, response, body){
    body = JSON.parse(body);
    res.json(body);
  });
});

// POST /users
app.post('/users',bodyParser.json(), function(req, res){
	var url = dUrl + '/users';
  googleMapsClient.geocode({
    address: req.body.address
  }, function(err, response) {
    if (!err) {
      var userData = {
        "prename": req.body.prename,
        "name": req.body.name,
        "username": req.body.username,
        "latitude": response.json.results[0].geometry.location.lat,
        "longitude": response.json.results[0].geometry.location.lng
      };
      var options = {
        uri : url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        json: userData
      }
      request(options, function(err, response, body){
    		res.json(body);
    	});
    } else {
      console.log(err);
    }
  });
});

// GET /userID
app.get('/users/:userID', bodyParser.json(), function (req, res){
	var userID = req.params.userID;
	var url = dUrl + '/users/' + userID;

	//helper method used
	request.get(url, function(err, response, body){
		body = JSON.parse(body);
		res.json(body);
	});
});

//PUT /userID
app.put('/users/:userID', bodyParser.json(), function(req, res){
	var userID = req.params.userID;
	var url = dUrl + '/users/' + userID;
	var userDataNew = {
		"vorname": req.body.vorname,
    "nachname": req.body.nachname
	};
	var options = {
		uri : url,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		json: userDataNew
	}
	request(options, function(err, response, body){
		res.json(body);
	});
});

/*app.delete('/users/:userID', function(req, res){
	var userID = req.params.userID;
	var url = dHost + ':' + dPort + '/users/' + userID;

	//helper method used
	request.delete(url, function(err, response, body){
		body = JSON.parse(body);
		res.json(body);
	});
});*/

// OFFER REQUESTS

// GET /offers
app.get('/offers', function(req,res){
	var url = dUrl + '/offers';

  // helper method, only for get requests
  request(url, function(err, response, body){
    body = JSON.parse(body);
    res.json(body);
	});
});

// POST /offers
app.post('/offers', bodyParser.json(), function(req, res){
	var url = dUrl + '/offers';
	var offerData = {
    "name": req.body.name,
    "description": req.body.description,
    "category" : req.body.category,
    "userID": req.body.userID
	}
	var options = {
		uri : url,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		json: offerData
	}
	request(options, function(err, response, body){
		res.json(body);
	});
});

// GET /offerID
app.get('/offers/:offerID', function (req, res){
	var offerID = req.params.offerID;
	var url = dUrl+ '/offers/' + offerID;

	//helper method used
	request.get(url, function(err, response, body){
		body = JSON.parse(body);
		res.json(body);
	});
});

// PUT /offerID
app.put('/offers/:offerID', bodyParser.json(), function(req, res){
	var offerID = req.params.offerID;
	var url = dUrl + '/offers/' + offerID;
	var offerDataNew = {
    "name": req.body.name,
    "description": req.body.description,
    "category" : req.body.category,
    "status" : req.body.status
	}
	var options = {
		uri : url,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		json: offerDataNew
	}
	request(options, function(err, response, body){
		res.json(body);
	});
});

// GET /category
/* app.get('/offers/category/:category', function(req, res){
	var categoryType = req.params.category;
	var url =  dHost + ':' + dPort + '/offers/' + 'category/' + categoryType;
	request(url, function (err, response, body){
		body = JSON.parse(body);
		res.json(body);
	});
}):*/

app.listen(3001, function(){
  console.log('Dienstnutzer läuft auf Port 3001.');
});
