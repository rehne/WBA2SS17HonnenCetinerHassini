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

var server = http.createServer();
var fayeServer = new faye.NodeAdapter({
  mount: '/faye',
  timeout: 45
});

fayeServer.attach(server);

var dHostLocal = 'http://localhost';
var dHostDeployed = 'https://wba2.herokuapp.com';
var dPort = 3000;
var dPortNutzer = 3001;
var dUrl = dHostDeployed;
var dUrlNutzerDeployed = dHostDeployed + ':' + dPortNutzer;
var dUrlNutzer = dHostLocal + ':' + dPortNutzer;

var fayeClient = new faye.Client(dHostDeployed + ':' + dPortNutzer + '/faye');

app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());

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
app.get('/logout', function(req, res){
  res.redirect('login');
});

// GET /users
app.get('/users', function(req, res){
  var url = dUrl + '/users';
  request(url, function(err, response, body){
    body = JSON.parse(body);
    res.json(body);
  });
});

// POST /users
app.post('/users', function(req, res) {
	var url = dUrl + '/users';
	if (req.body.address == null) {
    return res.status(406).send("Please stick to the form (firstname,lastname,adress");
  }
	googleMapsClient.geocode({
    address: req.body.address
  }, function(err, response) {
    if (!err) {
      var userData = {
        "firstname": req.body.firstname,
        "lastname": req.body.lastname,
        "username": req.body.username,
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
      request(options, function(err, response, body) {
    		res.json(body);
    	});
    } else {
      console.log(err);
    }
  });
});

// GET /users/userID
app.get('/users/:userID', function (req, res) {
	var userID = req.params.userID;
	var url = dUrl + '/users/' + userID;
	var url2 = dUrl + '/offers';
	request.get(url, function(err, response, body){
    request.get(url2, function (err2, response2, body2){
			if (response.statusCode == 200) {
      	body = JSON.parse(body);
				body2 = JSON.parse(body2);
			}
			res.json(body);
		});
	});
});

// PUT /users/:userID
app.put('/users/:userID', function(req, res) {
	var userID = req.params.userID;
	var url = dUrl + '/users/' + userID;
	if (req.body.address == null) {
    return res.status(406).send("please stick to the form");
  }
	googleMapsClient.geocode({
    address: req.body.address
  }, function(err, response) {
    if (!err) {
			var userDataNew = {
  			"firstname": req.body.firstname,
    		"lastname": req.body.lastname,
        "address": response.json.results[0].formatted_address,
        "latitude": response.json.results[0].geometry.location.lat,
        "longitude": response.json.results[0].geometry.location.lng
  		};
    	var options = {
    		uri : url,
    		method: 'PUT',
    		headers: {
    			'Content-Type': 'application/json'
    		},
    		json: userDataNew
    	}
    	request(options, function(err, response, body) {
        res.json(body);
    	});
  	} else {
      console.log(err);
    }
  });
});

// DELETE /users/:userID
app.delete('/users/:userID', function(req, res) {
	var userID = req.params.userID;
	var url = dUrl + '/users/' + userID;
	request.delete(url, function(err, response, body) {
    if (response.statusCode != 404) {
      return res.send(body + "User successfully deleted");
    }
		res.send(body);
	});
});

// OFFER REQUESTS

// GET /offers
app.get('/offers', function(req,res) {
	var url = dUrl + '/offers';

  request(url, function(err, response, body) {
    body = JSON.parse(body);
    res.json(body);
	});
});

// POST /offers
app.post('/offers', function(req, res) {
	var url = dUrl + '/offers';
	var offerData = {
    "name": req.body.name,
    "description": req.body.description,
    "category" : req.body.category,
    "createdByID": req.body.createdByID,
		"creatorUri": dUrlNutzer + /users/ + req.body.createdByID
	}
	var options = {
		uri : url,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		json: offerData
	}
	request(options, function(err, response, body) {
    		res.json(body);
	});
});

// GET /offers/:offerID
app.get('/offers/:offerID', function (req, res) {
	var offerID = req.params.offerID;
	var url = dUrl+ '/offers/' + offerID;

	request.get(url, function(err, response, body) {
    if (response.statusCode == 200) {
      body = JSON.parse(body);
    }
    res.json(body);
	});
});


// PUT /offers/:offerID
app.put('/offers/:offerID', function(req, res) {
	var offerID = req.params.offerID;
	var url = dUrl + '/offers/' + offerID;
	var offerDataNew = {
    "name": req.body.name,
    "description": req.body.description,
    "category" : req.body.category,
    "available" : req.body.status,
		"currentOwner" : req.body.currentOwner
	}
	var options = {
		uri : url,
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		json: offerDataNew
	}
	request(options, function(err, response, body) {
    res.json(body);
	});
});

// DELETE /offers/:offerID
app.delete('/offers/:offerID', function(req, res) {
	var offerID = req.params.offerID;
	var url = dUrl + '/offers/' + offerID;
	request.delete(url, function(err, response, body) {
    if (response.statusCode != 404) {
      return res.send(body + "User successfully deleted");
    }
		res.send(body);
	});
});

//GET/status/:offerID
//gives information about loan status of offer

app.get('/status/:offerID', function(req,res) {
	var offerID = req.params.offerID;
	var url = dUrl + '/offers/' + offerID;
	request.get(url, function(err, response, body) {
		if (response.statusCode == 200) {
			body = JSON.parse(body);
			if (body.status) {
        res.send("verfügbar");
      } else {
        res.send("verliehen");
      }
		} else {
      res.json(body);
    }
	});
});

//GET/ausleiher/:offerID
//returns current holder of offer
app.get('/ausleiher/:offerID', function(req,res) {
	var offerID = req.params.offerID
	var url = dUrl + '/offers/' + offerID;
	request.get(url,function(err,response,body) {
		if (response.statusCode == 200) {
			body = JSON.parse(body);
			if (body.currentOwner == null || body.status == true) {
        res.send("available");
      } else {
				var url = dUrl + '/users/' + body.currentOwner;
				request.get(url,function(err2,response2,body2) {
					body2 = JSON.parse(body2);
					res.send( "loaned to: " + body2.username);
				});
			}
		} else {
      res.json(body);
    }
	});
});

// GET /category
//returns all offers in a specified category
app.get('/offers/category/:category', function(req, res) {
	var categoryType = req.params.category;
	var category_offers = {"category_offers": []}
	var count = 0;
	var url =  dUrl + '/offers';
	request.get(url, function (err, response, body) {
		body = JSON.parse(body);
		for (var i = 0; i < body.length; i++) {
			if (body[i].category == categoryType) {
				category_offers.category_offers.push({
  				"id": body[i].id,
        	"name": body[i].name,
        	"description": body[i].description,
        	"category" : body[i].category,
        	"available" : body[i].status,
        	"createdByID": body[i].createdByID,
  				"currentOwner": body[i].currentOwner,
  				"latitude" : body2[i].latitude,
  				"longitude" : body2[i].longitude
				});
				count++;
			}
		}
		if (count == 0) {
      res.status(404).send("no offers in this category found");
    } else {
      res.json(category_offers);
    }
	});
});

// GET /offers/ausgeliehen/:userID
//returns a list of offers a specified user has loaned
app.get('/offers/ausgeliehen/:userID', function(req, res) {
	var userID = req.params.userID;
	var lent_offers = {"lent_offers": []};
	var count = 0;
	var url =  dUrl + '/offers';
	var url2 =  dUrl + '/users/' + userID;
	request.get(url, function (err, response, body) {
		request.get(url2, function (err2, response2, body2) {
			body = JSON.parse(body);
			for (var i = 0; i < body.length; i++) {
				if (body[i].currentOwner == userID) {
					lent_offers.lent_offers.push( {
  					"id": body[i].id,
        		"name": body[i].name,
        		"description": body[i].description,
        		"category" : body[i].category,
        		"available" : body[i].status,
        		"createdByID": body[i].createdByID,
  					"currentOwner": body[i].currentOwner,
  					"latitude" : body2[i].latitude,
  					"longitude" : body2[i].longitude
					});
					count++;
				}
			}
  		if (count == 0 && response2.statusCode == 200) {
        return res.status(404).send("nothing loaned");
      } else if (response2.statusCode == 404) {
        res.status(404).send("user doesn't exist");
      } else {
        res.json(lent_offers);
      }
		});
	});
});

// GET /standort
// return all offers close to a location that is given by client, approx. 5km radius
app.get('/offers/standort/:standort', function(req, res) {
	var standort = req.params.standort;
	var url = dUrl + '/offers';
	var nearby_offers = {"nearby_offers": []};
	var count = 0;
	request.get(url, function (err, response, body) {
		body = JSON.parse(body);
		googleMapsClient.geocode({
    address: req.params.standort
  	}, function(err, response) {
    	if (!err) {
      	var userData = {
        	"latitude": response.json.results[0].geometry.location.lat,
        	"longitude": response.json.results[0].geometry.location.lng
        };
        for (var i = 0; i < body.length; i++) {
          if (body[i].latitude >= (userData.latitude - 0.04) &&
              body[i].latitude <= (userData.latitude + 0.04) &&
              body[i].longitude >= (userData.longitude - 0.04) &&
              body[i].longitude <= (userData.longitude + 0.04) ) {
            nearby_offers.nearby_offers.push({
              "id": body[i].id,
              "name": body[i].name,
              "description": body[i].description,
              "category" : body[i].category,
              "available" : body[i].status,
              "createdByID": body[i].createdByID,
              "currentOwner": body[i].currentOwner,
              "latitude" : body[i].latitude,
              "longitude" : body[i].longitude
						});
					count++;
  				}
  			}
  			if (count == 0) {
          return res.status(404).send("no offers in this area found");
        } else {
          res.json(nearby_offers);
        }
  		}
		});
	});
});

// GET /offers/suche/:suchwort
// searches offers that containt specified word and returns offers that match the criteria
app.get('/offers/suche/:suchwort', function(req, res) {
	var suchwort = req.params.suchwort;
	var url = dUrl + '/offers';
	var searched_offers = {"searched_offers": []};
	var count = 0;
	request.get(url, function (err, response, body) {
		body = JSON.parse(body);
		for (var i = 0; i < body.length; i++) {
			if (body[i].name.search(suchwort) != -1 ||
          body[i].description.search(suchwort) != -1 ||
          body[i].category.search(suchwort) != -1) {
				searched_offers.searched_offers.push( {
					"id": body[i].id,
      		"name": body[i].name,
      		"description": body[i].description,
      		"category" : body[i].category,
      		"available" : body[i].status,
      		"createdByID": body[i].createdByID,
					"currentOwner": body[i].currentOwner,
					"latitude" : body[i].latitude,
					"longitude" : body[i].longitude
				});
				count++;
			}
		}
		if (count == 0) {
      return res.status(404).send("no offers containing this word found");
    } else {
      res.json(searched_offers);
    }
	});
});

app.listen(3001, function(){
  console.log('Dienstnutzer läuft auf Port 3001.');
});
