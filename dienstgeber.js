var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

const settings = {
  port: process.env.PORT || 3000,
  database: './database.json'
};

app.use(function(err, req, res, next){
  console.log(err.stack);
  res.end(err.status + ' ' + err.messages);
});

app.use(function(req, res, next){
  console.log('Time ' + Date.now() + ' | Request-Path: ' + req.path);
  next();
});

/* User Methoden */

// GET /users
app.get('/users', function(req, res){
  fs.readFile(settings.database, function(err, data){

    if(err){
        console.log(err);
        res.status(500).send("database error")
    }
    var user = JSON.parse(data);
    res.status(200).send(user.users);
  });
});

// POST /users
app.post('/users', function(req, res){
  fs.readFile(settings.database, function(err, data){
    var user = JSON.parse(data);
    var max_index = 0;
    var current_i = user.users.length;

    // id of the last user is inserted into max_index
    for (var i = 0; i < user.users.length; i++){
      if (user.users[i].id > max_index){
        max_index = user.users[i].id;
      }
    }

    // Check if username is already assigned. Print an error or add an new user
    for (var i = 0; i < user.users.length; i++){
      if (user.users[i].username == req.body.username){
        current_i = i;
      }
    }
    if (current_i < user.users.length){
      res.status(409).send("Username not available");
    } else {
			if (req.body.firstname == null ||
          req.body.lastname == null ||
          req.body.username == null ||
          req.body.address == null ) {
				return res.status(406).send("Please stick to the form");
			}
      user.users.push({
        "id": ++max_index,
        "firstname": req.body.firstname,
        "lastname": req.body.lastname,
        "username": req.body.username,
				"address": req.body.address,
        "latitude": req.body.latitude,
        "longitude": req.body.longitude,
				"own_offers": []
      });
      fs.writeFile(settings.database, JSON.stringify(user, null, 2));
      res.write("User saved");
      res.status(201);
      res.end();
    }
  });
});

// GET /users/:userID
app.get('/users/:userID', function(req,res){
  fs.readFile(settings.database, function(err, data){
    var user = JSON.parse(data);
    var current_i = user.users.length;

    //Find the position of the searched user and save it in current_i
    for (var i = 0; i < user.users.length; i++ ) {
      if (user.users[i].id == req.params.userID) {
        current_i = i;
      }
    }
    // if current_i is already the same like number of the users, there are no user found. is current_i not the same, print the user
    if (current_i < user.users.length) {
      res.status(200).send(user.users[current_i]);
    } else {
      res.status(404).send("User not found");
    }
  });
});

// PUT /users/:userID
app.put('/users/:userID', function(req, res) {
  fs.readFile(settings.database, function(err, data) {
    var user = JSON.parse(data);

		if (req.body.firstname == null || req.body.lastname == null ||  req.body.address == null ){
				return res.status(406).send("Please stick to the form");
		}
    //find the searched user and edit his attribute
    for (var i = 0; i < user.users.length; i++ ) {
      if (user.users[i].id == req.params.userID) {
        user.users[i].firstname = req.body.firstname;
        user.users[i].lastname = req.body.lastname;
				user.users[i].address = req.body.address;
        user.users[i].longitude = req.body.longitude;
        user.users[i].latitude = req.body.latitude;
        fs.writeFile(settings.database, JSON.stringify(user, null, 2));
        return res.status(200).send("User successfully edited");
      }
    }
    res.status(404).send("User doesn't exist");
  });
});

// DELETE /users/:userID
app.delete('/users/:userID', function(req, res) {
  fs.readFile(settings.database, function(err, data) {
    var user = JSON.parse(data);
    var current_i = user.users.length;

    // Find the position of the searched user and save it in current_i
    for (var i = 0; i < user.users.length; i++ ) {
      if (user.users[i].id == req.params.userID) {
        current_i = i;
      }
    }
    // if current_i is already the same like number of the users, there are no user found. is current_i not the same, delete the user
    if (current_i < user.users.length) {
      user.users.splice(current_i,1);
      fs.writeFile(settings.database, JSON.stringify(user, null, 2));
      res.status(204).send("User successfully deleted");
    } else {
      res.status(404).send("User not found ");
    }
  });
});

/* Offer Methoden */

// GET /offers
app.get('/offers', function(req, res) {
  fs.readFile(settings.database, function(err, data) {
    var offers = JSON.parse(data);
    if(err){
        console.log(err);
        res.status(500).send("database error")
    }

    res.status(200).send(offers.offers);
  });
});

// POST /offers
app.post('/offers', bodyParser.json(), function(req, res) {
  fs.readFile(settings.database, function(err, data) {
    var offer = JSON.parse(data);
    var max_index = 0;
    // id of the last offer is inserted into max_index
    for (var i = 0; i < offer.offers.length; i++) {
      if (offer.offers[i].id > max_index){
        max_index = offer.offers[i].id;
      }
    }
		if (req.body.name == null ||
        req.body.description == null ||
        req.body.category == null ||
        req.body.erstelltvonID == null ) {
			return res.status(406).send("Please stick to the form");
		}
    //add a new offer
    offer.offers.push( {
      "id": ++max_index,
      "name": req.body.name,
      "description": req.body.description,
      "category" : req.body.category,
      "erstelltvonID" : req.body.erstelltvonID,
			"uri_von_Ersteller" : req.body.uri_von_Ersteller,
			"status" : true,
			"imBesitzvonID": null,
			"latitude": null,
      "longitude": null
    });
		for (var x = 0; x < offer.users.length; x++) {
			if (offer.users[x].id == req.body.erstelltvonID) {
				offer.users[x].own_offers.push({
					"offerID": max_index,
  				"offer_uri": 'http://localhost:3001/offers/' + max_index
				});
			}
		}
    fs.writeFile(settings.database, JSON.stringify(offer, null, 2));
    res.write("" + max_index);
   	res.status(201);
  	res.end();
  });
});

// GET /:offerID
app.get('/offers/:offerID', function(req,res) {
  fs.readFile(settings.database, function(err, data) {
    var offer = JSON.parse(data);
    var  current_i = offer.offers.length;
    //Find the position of the searched offer and save it in current_i
    for (var i = 0; i < offer.offers.length; i++ ) {
      if (offer.offers[i].id == req.params.offerID) {
        current_i = i;
      }
    }
    //if current_i is already the same like number of the offers, there are no offer found. is current_i not the same, print the offer
    if (current_i < offer.offers.length) {
      res.status(200).send(offer.offers[current_i]);
    } else {
      res.status(404).send("Offer not found");
    }
  });
});

// PUT /:offerID
app.put('/offers/:offerID', function(req, res) {
  fs.readFile(settings.database, function(err, data) {
    var offer = JSON.parse(data);
		if (req.body.name == null || req.body.description == null || req.body.category == null ) {
				return res.status(406).send("Please stick to the form");
		}
    //find the searched user and edit his attribute
    for (var i = 0; i < offer.offers.length; i++ ) {
      if (offer.offers[i].id == req.params.offerID) {
        offer.offers[i].name = req.body.name;
        offer.offers[i].description = req.body.description;
        offer.offers[i].category = req.body.category;
				if (req.body.imBesitzvonID == null) {
          offer.offers[i].imBesitzvonID = null;
        } else {
          offer.offers[i].imBesitzvonID = req.body.imBesitzvonID;
        }
				for (var x = 0; x < offer.users.length; x++) {
					if (offer.users[x].id == req.body.imBesitzvonID) {
						offer.offers[i].latitude = offer.users[x].latitude;
						offer.offers[i].longitude = offer.users[x].longitude;
					}
				}
				if (offer.offers[i].imBesitzvonID != null ) {
					offer.offers[i].status = false;
				}
        fs.writeFile(settings.database, JSON.stringify(offer, null, 2));
        return res.status(200).send("Offer successfully edited");
      }
    }
    res.status(404).send("This offer doesn't exist");
  });
});

// DELETE /offers/:offerID
app.delete('/offers/:offerID', function(req, res) {
  fs.readFile(settings.database, function(err, data) {
    var offer = JSON.parse(data);
    var current_i ;

    //Find the position of the searched offer and save it in current_i
    for (var i = 0; i < offer.offers.length; i++ ) {
      if (offer.offers[i].id == req.params.offerID) {
        current_i = i;
      }
    }
    // if current_i is already the same like number of the offers, there are no offer found. is current_i not the same, delete the offer
    if (current_i < offer.offers.length){
      offer.offers.splice(current_i, 1);
      fs.writeFile(settings.database, JSON.stringify(offer, null, 2));
      res.status(204).send("Offer successfully deleted");
    } else {
      res.status(404).send("Offer not found");
    }
  });
});

app.listen(settings.port, function(){
  console.log("Dienstgeber läuft auf Port " + settings.port + ".");
});
