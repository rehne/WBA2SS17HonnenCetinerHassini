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
  console.log('Time ' + Date.now() + ' | Request-Pfad: ' + req.path);
  next();
});

/* User Methoden */

// GET /users
app.get('/users', function(req, res){
  fs.readFile(settings.database, function(err, data){
    var user = JSON.parse(data);
    res.status(200).send(user.users);
  });
});

// POST /users
app.post('/users', bodyParser.json(), function(req, res){
  fs.readFile(settings.database, function(err, data){
    var user = JSON.parse(data);
    var max_index = 0;
    var current_i = user.users.length;

    // id of the last user is inserted into max_index
    for(var i = 0; i < user.users.length; i++){
      if(user.users[i].id > max_index){
        max_index = user.users[i].id;
      }
    }

    // Check if username is already assigned. Print an error or add an new user
    for(var i = 0; i < user.users.length; i++){
      if(user.users[i].username == req.body.username){
        current_i = i;
      }
    }
    if(current_i < user.users.length){
      res.status(409).send("Benutzername ist schon vergeben");
    } else {
      user.users.push({
        "id": ++max_index,
        "prename": req.body.prename,
        "name": req.body.name,
        "username": req.body.username,
				"password": req.body.password,
				"address": req.body.address,
        "latitude": req.body.latitude,
        "longitude": req.body.longitude,
				"oen_offers": []
      });
      fs.writeFile(settings.database, JSON.stringify(user, null, 2));
      res.write("" + max_index);
      res.status(201);
      res.end();

    }
  });
});

// GET /usersID
app.get('/users/:userID', function(req,res){
  fs.readFile(settings.database, function(err, data){
    var user = JSON.parse(data);
    var current_i = user.users.length;

    //Find the position of the searched user and save it in current_i
    for(var i = 0; i < user.users.length; i++ ){
      if(user.users[i].id == req.params.userID){
        current_i = i;
      }
    }
//if current_i is already the same like number of the users, there are no user found. is current_i not the same, print the user
    if(current_i < user.users.length){
      res.status(200).send(user.users[current_i]);
    } else {
      res.status(404).send("User NOT FOUND");
    }
  });
});

// PUT /usersID
app.put('/users/:userID', bodyParser.json(), function(req, res){
  fs.readFile(settings.database, function(err, data){
    var user = JSON.parse(data);
    //find the searched user and edit his attribute
    for(var i = 0; i < user.users.length; i++ ){
      if(user.users[i].id == req.params.userID){
        user.users[i].prename = req.body.prename;
        user.users[i].name = req.body.name;
				user.users[i].address = req.body.address;
				
        fs.writeFile(settings.database, JSON.stringify(user, null, 2));
        return res.status(200).send("User erfolgreich bearbeitet");
      }
    }
    res.status(404).send("User zum bearbeiten nicht vorhanden.");
  });
});

// DELETE /usersID
app.delete('/users/:userID', function(req, res){
  fs.readFile(settings.database, function(err, data){
    var user = JSON.parse(data);
    var current_i = user.users.length;

    // Find the position of the searched user and save it in current_i
    for(var i = 0; i < user.users.length; i++ ){
      if(user.users[i].id == req.params.userID){
        current_i = i;
      }
    }
    // if current_i is already the same like number of the users, there are no user found. is current_i not the same, delete the user
    if(current_i < user.users.length){
      user.users.splice(current_i,1);
      fs.writeFile(settings.database, JSON.stringify(user, null, 2));
      res.status(204).send("User erfolgreich gelöscht");
    } else {
      res.status(404).send("User NOT FOUND");
    }
  });
});

/* Offer Methoden */

// GET /offers
app.get('/offers', function(req, res){
  fs.readFile(settings.database, function(err, data){
    var offers = JSON.parse(data);
    res.status(200).send(offers.offers);
  });
});

// POST /offers
app.post('/offers', bodyParser.json(), function(req, res){
  fs.readFile(settings.database, function(err, data){
    var offer = JSON.parse(data);
    var max_index = 0;
    // id of the last offer is inserted into max_index
    for(var i = 0; i < offer.offers.length; i++){
      if(offer.offers[i].id > max_index){
        max_index = offer.offers[i].id;
      }
    }
    //add a new offer
    offer.offers.push({
      "id": ++max_index,
      "name": req.body.name,
      "description": req.body.description,
      "category" : req.body.category,
      "erstelltvonID" : req.body.erstelltvonID,
			"status" : true,
			"imBesitzvonID": null,
			"latitude": null,
      "longitude": null,
    });
    fs.writeFile(settings.database, JSON.stringify(offer, null, 2));
    res.write("" + max_index);
     	res.status(201);
      	res.end();
  });
});

// GET /:offerID
app.get('/offers/:offerID', function(req,res){
  fs.readFile(settings.database, function(err, data){
    var offer = JSON.parse(data);
    var  current_i = offer.offers.length;
    //Find the position of the searched offer and save it in current_i
    for(var i = 0; i < offer.offers.length; i++ ){
      if(offer.offers[i].id == req.params.offerID){
        current_i = i;
      }
    }
    //if current_i is already the same like number of the offers, there are no offer found. is current_i not the same, print the offer
    if(current_i < offer.offers.length){
      res.status(200).send(offer.offers[current_i]);
    } else {
      res.status(404).send("Offer NOT FOUND");
    }
  });
});

// PUT /:offerID
app.put('/offers/:offerID', bodyParser.json(), function(req, res){
  fs.readFile(settings.database, function(err, data){
    var offer = JSON.parse(data);
    //find the searched user and edit his attribute
    for(var i = 0; i < offer.offers.length; i++ ){
      if(offer.offers[i].id == req.params.offerID){
        offer.offers[i].name = req.body.name;
        offer.offers[i].description = req.body.description;
        offer.offers[i].category = req.body.category;
				offer.offers[i].imBesitzvonID = req.body.imBesitzvonID;
				for(var x = 0; x < offer.users.length; x++){
					if(offer.users[x].id == req.body.imBesitzvonID){
						offer.offers[i].latitude = offer.users[x].latitude;
						offer.offers[i].longitude = offer.users[x].longitude;
					}
				}
				if(offer.offers[i].imBesitzvonID != null ) offer.offers[i].status = false;
        fs.writeFile(settings.database, JSON.stringify(offer, null, 2));
        return res.status(200).send("Offer erfolgreich bearbeitet");
      }
    }
    res.status(404).send("Offer zum Bearbeiten nicht vorhanden");
  });
});

// DELETE /:offerID
app.delete('/offers/:offerID', function(req, res){
  fs.readFile(settings.database, function(err, data){
    var offer = JSON.parse(data);
    var current_i ;

    //Find the position of the searched offer and save it in current_i
    for(var i = 0; i < offer.offers.length; i++ ){
      if(offer.offers[i].id == req.params.offerID){
        current_i = i;
      }
    }
    //if current_i is already the same like number of the offers, there are no offer found. is current_i not the same, delete the offer
    if(current_i < offer.offers.length){
      offer.offers.splice(current_i, 1);
      fs.writeFile(settings.database, JSON.stringify(offer, null, 2));
      res.status(204).send("Offer erfolgreich gelöscht");
    } else {
      res.status(404).send("Offer NOT FOUND");
    }
  });
});

app.listen(settings.port, function(){
  console.log("Dienstgeber läuft auf Port " + settings.port + ".");
});
