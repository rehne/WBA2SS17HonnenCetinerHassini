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
    var counter = 0;
    for(var i = 0; i < user.users.length; i++){
    	if(user.users[i].id > counter){
        counter = user.users[i].id;
      }
    }
    user.users.push({
      "id": ++counter,
      "vorname": JSON.stringify(req.body.vorname),
      "nachname": JSON.stringify(req.body.nachname)
    });
    fs.writeFile(settings.database, JSON.stringify(user, null, 2));
  });
  res.status(201).send("User erfolgreich gespeichert!\n");
});
// GET /usersID
app.get('/users/:userID', function(req,res){
  fs.readFile(settings.database, function(err, data){
    var user = JSON.parse(data);
    for(var i = 0; i < user.users.length; i++){
      if(user.users[i].id == req.params.userID){
        res.status(200).send(user.users[i]);
      }
    }
  });
});
// PUT /usersID
app.put('/users/:userID', bodyParser.json(), function(req, res){
  fs.readFile(settings.database, function(err, data){
    var user = JSON.parse(data);
    for(var i = 0; i < user.users.length; i++ ){
      if(user.users[i].id == req.params.userID){
        user.users[i].vorname = JSON.stringify(req.body.vorname);
        user.users[i].nachname = JSON.stringify(req.body.nachname);
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
    for(var i = 0; i < user.users.length; i++ ){
    	if(user.users[i].id == req.params.userID){
    		user.users.splice(i, 1);
      	fs.writeFile(settings.database, JSON.stringify(user, null, 2));
      	res.status(204).send("User erfolgreich gelöscht");
    	}
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
    var counter = 0;
    for(var i = 0; i < offer.offers.length; i++){
    	if(offer.offers[i].id > counter) counter = offer.offers[i].id
    }
    offer.offers.push({
      "id": ++counter,
      "name": JSON.stringify(req.body.name),
      "description": JSON.stringify(req.body.description)
    });
    fs.writeFile(settings.database, JSON.stringify(offer, null, 2));
  });
  res.status(201).send("Offer erfolgreich gespeichert!\n");
});
// GET /:offerID
app.get('/offers/:offerID', function(req,res){
  fs.readFile(settings.database, function(err, data){
    var offer = JSON.parse(data);
    for(var i = 0; i < offer.offers.length; i++ ){
      if(offer.offers[i].id == req.params.offerID){
        res.status(200).send(offer.offers[i]);
      }
    }
  });
});
// PUT /:offerID
app.put('/offers/:offerID', bodyParser.json(), function(req, res){
  fs.readFile(settings.database, function(err, data){
    var offer = JSON.parse(data);
    for(var i = 0; i < offer.offers.length; i++ ){
      if(offer.offers[i].id == req.params.offerID){
        offer.offers[i].name = JSON.stringify(req.body.name);
        offer.offers[i].description = JSON.stringify(req.body.description);
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
    for(var i = 0; i < offer.offers.length; i++ ){
    	if(offer.offers[i].id == req.params.offerID){
    		offer.offers.splice(i,1);
      	fs.writeFile(settings.database, JSON.stringify(offer, null, 2));
      	res.status(204).send("Offer erfolgreich gelöscht");
    	}
	   }
	});
});

app.listen(settings.port, function(){
  console.log("Dienstgeber läuft auf Port " + settings.port + ".");
});
