var fs = require('fs');
var express = require('express');
var bodyParser=require('body-parser');

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

app.get('/', function(req, res){
  res.status(200).send('Hello World!');
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
        "latitude": req.body.latitude,
        "longitude": req.body.longitude
      });
      fs.writeFile(settings.database, JSON.stringify(user, null, 2));
      res.status(201).send("Benutzer erfolgreich gespeichert!\n");
    }
  });
});

// GET /usersID
app.get('/users/:userID', function(req,res){
  fs.readFile(settings.database, function(err, data){
    var user = JSON.parse(data);
    var  current_i = user.users.length;

    //if current_offers are not empty clear current_offers to avoid duplicated offers
    if(user.current_offers.length > 0){
    user.current_offers.splice(0, user.current_offers.length);
      fs.writeFile(settings.database, JSON.stringify(user, null, 2));
    }

    //Find the position of the searched user and save it in current_i
    for(var i = 0; i < user.users.length; i++ ){
      if(user.users[i].id == req.params.userID){
        current_i = i;
      }
    }

    //if current_i is already the same like number of the users, there are no user found. is current_i not the same, assign the offers to the users and print the user with his offers
    if(current_i < user.users.length){
      for(var i = 0; i< user.offers.length; i++){
        if(user.users[current_i].id == user.offers[i].userID){
          user.current_offers.push({
            "name": user.offers[i].name,
            "description": user.offers[i].description,
            "category": user.offers[i].category,
            "status" : user.offers[i].status
          });
        }
      }
      fs.writeFile(settings.database, JSON.stringify(user, null, 2));
      var ausgabe = { "user" : user.users[current_i],
                     "offers" : user.current_offers

      };
      res.status(200).send(ausgabe);
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
        fs.writeFile(settings.database, JSON.stringify(user, null, 2));
        res.status(200).send("User erfolgreich bearbeitet");
      }
    }
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
      "status" : true,
      "userID": req.body.userID
    });
    fs.writeFile(settings.database, JSON.stringify(offer, null, 2));
  });
  res.status(201).send("Offer erfolgreich gespeichert!\n");
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
        offer.offers[i].status = true;
        fs.writeFile(settings.database, JSON.stringify(offer, null, 2));
        res.status(200).send("Offer erfolgreich bearbeitet");
      }
    }
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
      offer.offers.splice(current_i,1);
      fs.writeFile(settings.database, JSON.stringify(offer, null, 2));
      res.status(204).send("Offer erfolgreich gelöscht");
    } else {
      res.status(404).send("Offer NOT FOUND");
    }
  });
});

//GET /:category
app.get('/offers/category/:category', function(req,res){
  fs.readFile(settings.database, function(err, data){
    var offer = JSON.parse(data);
    var current_i = offer.offers.length;
    var count = 0;

    //if current_offers are not empty clear current_offers to avoid duplicated offers, if current_offers is already empty, send error
    if(offer.current_offers.length > 0){
    offer.current_offers.splice(0, offer.current_offers.length);
      fs.writeFile(settings.database, JSON.stringify(offer, null, 2));
    } else if(offer.offers.length == 0){
      res.status(404).send("No offers found");
    }

    //Find the offers with the searched category and save it in current_offers. if there is an offer with the searched category Count++. after loop check count. if count is already 0, send error. if count > 0 there are offers with the searched category. send them
    for(var i = 0; i < offer.offers.length; i++ ){
      if(offer.offers[i].category == req.params.category){
        offer.current_offers.push({
          "name": offer.offers[i].name,
          "description": offer.offers[i].description,
          "category": offer.offers[i].category,
          "status" : offer.offers[i].status
        });
        count++;
      }
    }
    if(count > 0){
      fs.writeFile(settings.database, JSON.stringify(offer, null, 2));
      res.status(200).send(offer.current_offers);
    } else {
      res.status(404).send("Category NOT FOUND");
    }
  });
});

app.listen(settings.port, function(){
  console.log("Dienstgeber läuft auf Port " + settings.port + ".");
});
