var http = require('http');
var express = require('express');
var request = require('request');
var app = express();
var bodyParser = require('body-parser');

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
app.post('/users/',bodyParser.json(), function(req, res){

	var url = dUrl + '/users';

	var userData = {
		"vorname": req.body.vorname,
        "nachname": req.body.nachname,
        "benutzername": req.body.benutzername
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
			body = JSON.parse(body);
			res.json(body);
	});
});
		// DELETE /userID
		app.delete('/users/:userID', function(req, res){

			var userID = req.params.userID;
			var url = dUrl + '/users/' + userID;

			
			request.delete(url, function(err, response, body){
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
			body = JSON.parse(body);
			res.json(body);
	});
});

			// GET /offerID
app.get('/offers/:offerID', function (req, res){

	var offerID = req.params.offerID;
	var url = dUrl+ '/offers/' + offerID;

	
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
			body = JSON.parse(body);
			res.json(body);
	});
});


	// DELETE /offerID
		app.delete('/offers/:offerID', function(req, res){

			var offerID = req.params.offerID;
			var url = dUrl + '/offers/' + offerID;

			
			request.delete(url, function(err, response, body){
			}); 
		});

		// GET /category
app.get('/offers/category/:category', function(req, res){

		var categoryType = req.params.category;

		var url =  dUrl + '/offers/' + 'category/' + ":" + categoryType;

		request(url, function (err, response, body){
			body = JSON.parse(body);
			res.json(body);

		})

}) 

app.listen(3001, function(){
  console.log('Dienstnutzer läuft auf Port 3001.');
});
