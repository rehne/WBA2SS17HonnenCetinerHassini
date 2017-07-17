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

var dHost = 'http://localhost';
var dPort = 3000;
var dPortNutzer = 3001;
var dUrl = dHost + ':' + dPort;
var dUrlNutzer = dHost + ':' + dPortNutzer;

var fayeClient = new faye.Client(dHost + ':' + dPortNutzer + '/faye');

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
    return res.status(406).send("please stick to the form");
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
        // fayeClient.publish('/test', {text: 'Hello World!'});
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

  // helper method, only for get requests
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
    "erstelltvonID": req.body.erstelltvonID,
		"uri_von_Ersteller": dUrlNutzer + /users/ + req.body.erstelltvonID
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

		if (response.statusCode != 409) {
    		res.json(dUrlNutzer + '/offers/' + body);
    	} else {
    		res.json(body);
    	}
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
//gibt aus, ob ein bestimmter Offer verfügbar oder verliehen ist
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
//gibt aus, an wen ein bestimmter Offer verliehen ist
app.get('/ausleiher/:offerID', function(req,res) {
	var offerID = req.params.offerID
	var url = dUrl + '/offers/' + offerID;
	request.get(url,function(err,response,body) {
		if (response.statusCode == 200) {
			body = JSON.parse(body);
			if (body.imBesitzvonID == null || body.status == true) {
        res.send("available");
      } else {
				var url = dUrl + '/users/' + body.imBesitzvonID;
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
//gibt alle Offers mit einer bestimmten Kategorie aus
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
        	"status" : body[i].status,
        	"erstelltvonID": body[i].erstelltvonID,
  				"imBesitzvonID": body[i].imBesitzvonID,
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
// gibt eine Liste aller ausgeliehenen Offer eines bestimmten Users aus
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
				if (body[i].imBesitzvonID == userID) {
					lent_offers.lent_offers.push( {
  					"id": body[i].id,
        		"name": body[i].name,
        		"description": body[i].description,
        		"category" : body[i].category,
        		"status" : body[i].status,
        		"erstelltvonID": body[i].erstelltvonID,
  					"imBesitzvonID": body[i].imBesitzvonID,
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
// gibt alle Offers in der Nähe eines bestimmten Standortes, der vom Client eingegeben wird, aus. In der Nähe bedeutet ca. 5km Umkreis
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
              "status" : body[i].status,
              "erstelltvonID": body[i].erstelltvonID,
              "imBesitzvonID": body[i].imBesitzvonID,
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
// sucht nach Offers die das Suchwort, das der Client eingibt, beinhalten und gibt diese aus
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
      		"status" : body[i].status,
      		"erstelltvonID": body[i].erstelltvonID,
					"imBesitzvonID": body[i].imBesitzvonID,
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
