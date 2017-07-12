var http = require('http');
var path = require('path');
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

app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');

// Routen
app.get('/login', function(req, res){
  res.render('login');
});
app.get('/register', function(req, res){
  res.render('register');
});
app.get('/dashboard', function(req, res){
  res.render('dashboard');
});
app.get('/profile', function(req, res){
  res.render('profile');
});
app.get('/logout', function(req, res){
  res.redirect('/login');
});

// GET /users
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
				"password": req.body.password,
				"address": response.json.results[0].formatted_address,
        "latitude": response.json.results[0].geometry.location.lat,
        "longitude": response.json.results[0].geometry.location.lng
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

// PUT /users/:userID
app.put('/users/:userID', bodyParser.json(), function(req, res){
	var userID = req.params.userID;
	var url = dUrl + '/users/' + userID;
	var userDataNew = {
		"prename": req.body.prename,
    "name": req.body.name,
		"address": req.body.address
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
    res.json(body);
	});
});

// DELETE /users/:userID
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
    "userID": req.body.userID,
		"imBesitzvonID": req.body.userID
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

// GET /offers/:offerID
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

// PUT /offers/:offerID
app.put('/offers/:offerID', bodyParser.json(), function(req, res){
	var offerID = req.params.offerID;
	var url = dUrl + '/offers/' + offerID;
	var offerDataNew = {
    "name": req.body.name,
    "description": req.body.description,
    "category" : req.body.category,
    "status" : req.body.status,
		"imBesitzvonID" : req.body.imBesitzvonID
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

// DELETE /offers/:offerID
app.delete('/offers/:offerID', function(req, res){
	var offerID = req.params.offerID;
	var url = dUrl + '/offers/' + offerID;

	request.delete(url, function(err, response, body){
    res.send(body);
	});
});

//GET/status/:offerID
app.get('/status/:offerID', function(req,res){
	var offerID = req.params.offerID;
	var url = dUrl + '/offers/' + offerID;

	request.get(url, function(err, response, body){
		if(response.statusCode == 200){
			body = JSON.parse(body);
			if(body.status) res.send("verfügbar");
			else res.send("verliehen");
		}
		else(res.json(body));
	});
});

//GET/ausleiher/:offerID
app.get('/ausleiher/:offerID', function(req,res){
	var offerID = req.params.offerID
	var url = dUrl + '/offers/' + offerID;

	request.get(url,function(err,response,body){
		if(response.statusCode == 200){
			body = JSON.parse(body);
			if(body.userID == body.imBesitzvonID || body.status == true) res.send("an niemanden Verliehen");
			else{
				var url = dUrl + '/users/' + body.imBesitzvonID;
				request.get(url,function(err2,response2,body2){

					console.log(body2);
					res.send( "verliehen an: " + body2.username);
				});
			}
		}
		else(res.json(body));
	});
});

// GET /category
app.get('/offers/category/:category', function(req, res){
	var categoryType = req.params.category;
	var url =  dUrl + '/offers/category/' + categoryType;
	request(url, function (err, response, body){
		if(response.statusCode == 200){
      body = JSON.parse(body);
    }
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
