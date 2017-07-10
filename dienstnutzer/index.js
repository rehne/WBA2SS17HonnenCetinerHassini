var http = require('http');
var express = require('express');
var request = require('request');
var app = express();

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
app.post('/users/', function(req, res){

	var url = dHost + ':' + dPort + '/users/';

	var userData = {
		"vorname": "Aziz",
        "nachname": "Cetiner",
        "benutzername": "acetiner"
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
app.get('/users/:userID', function (req, res){

	var userID = req.params.userID;
	var url = dHost + ':' + dPort + '/users/' + userID;

	//helper method used
	request.get(url, function(err, response, body){
		body = JSON.parse(body);
		res.json(body);

	});
});

			//PUT /userID
app.put('/users/:userID', function(req, res){

	var userID = req.params.userID;
	var url = dHost + ':' + dPort + '/users/' + userID;

	var userDataNew = {
		"vorname": "Peter",
        "nachname": "Cetiner"
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
app.post('/offers', function(req, res){

	var url = dHost + ':' + dPort + '/offers';

	var offerData = {
      "name": "Herr der Ringe",
      "description": "Film",
      "category" : "blueray",
      "status" : true,
      "userID": 1
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
	var url = dHost + ':' + dPort + '/offers/' + offerID;

	//helper method used
	request.get(url, function(err, response, body){
		body = JSON.parse(body);
		res.json(body);

	});
});

			// PUT /offerID
app.put('/offers/:offerID', function(req, res){

	var offerID = req.params.offerID;
	var url = dHost + ':' + dPort + '/offers/' + offerID;

	var offerDataNew = {
      "name": "Dexter",
      "description": "Film",
      "category" : "blueray",
      "status" : true,
      "userID": 1
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
/*app.get('/offers/category/:category', function(req, res){

		var categoryType = req.params.category;

		var url =  dHost + ':' + dPort + '/offers/' + 'category/' + categoryType;

		request(url, function (err, response, body){
			body = JSON.parse(body);
			res.json(body);

		})

}) */


app.listen(3001, function(){
  console.log('Dienstnutzer läuft auf Port 3001.');
});
