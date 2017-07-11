var http = require('http');
var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');
var faye = require('faye');

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
				"address": response.json.results[0].formatted_address,
        "latitude": response.json.results[0].geometry.location.lat,
        "longitude": response.json.results[0].geometry.location.lng,
        "address": response.json.results[0].formatted_address
      };
      var options = {
        uri: url,
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

// GET /users/userID
app.get('/users/:userID', bodyParser.json(), function (req, res){
	var userID = req.params.userID;
	var url = dUrl + '/users/' + userID;

	request.get(url, function(err, response, body){
    if(response.statusCode == 200){
      body = JSON.parse(body);
    }
    res.json(body);
	});
});

//PUT /userID
app.put('/users/:userID', bodyParser.json(), function(req, res){
	var userID = req.params.userID;
	var url = dUrl + '/users/' + userID;
	var userDataNew = {
		"prename": req.body.prename,
    "name": req.body.name
	};
	var options = {
		uri : url,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		json: userDataNew
	}

  // publish
  /*
  client.publish('/news', { text: 'Test yo'})
  .then(function() {

  		console.log('Message received by server!');
  }, function(error) {

  	console.log('there was an error publishing: ' + error.message);
  });
  */

	request(options, function(err, response, body){
    if(response.statusCode == 200){
      body = JSON.parse(body);
    }
    res.json(body);
	});
});

// DELETE /userID
app.delete('/users/:userID', function(req, res){
	var userID = req.params.userID;
	var url = dUrl + '/users/' + userID;

	request.delete(url, function(err, response, body){
    res.send(body);
	});
});

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

// GET /offers/offerID
app.get('/offers/:offerID', function (req, res){
	var offerID = req.params.offerID;
	var url = dUrl+ '/offers/' + offerID;

	request.get(url, function(err, response, body){
    if(response.statusCode == 200){
      body = JSON.parse(body);
    }
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
    if(response.statusCode == 200){
      body = JSON.parse(body);
    }
    res.json(body);
	});
});

// DELETE /offerID
app.delete('/offers/:offerID', function(req, res){
	var offerID = req.params.offerID;
	var url = dUrl + '/offers/' + offerID;

	request.delete(url, function(err, response, body){
    res.send(body);
	});
});

// GET /category
app.get('/offers/category/:category', function(req, res){
	var categoryType = req.params.category;

	var url =  dUrl + '/offers/' + 'category/' + ":" + categoryType;

	request(url, function (err, response, body){
		body = JSON.parse(body);
		res.json(body);
	});
});

/*
// ------------- FAYE -----------

var fayeserver = new faye.NodeAdapter({
		mount : '/faye',
		timeout : 45
});

fayeserver.attach(app);

var client = new faye.Client('http://localhost:3001/faye');
client.subscribe('/news', function(message){
		console.log(message.text);
});
*/

app.listen(3001, function(){
  console.log('Dienstnutzer läuft auf Port 3001.');
});