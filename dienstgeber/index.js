var fs = require('fs');
var express = require('express');
var bodyParser=require('body-parser');

var app = express();
app.use(bodyParser.json());


const settings = {
  port: 3000
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

// User Methoden
app.get('/users', function(req, res){
  fs.readFile('database.json', function(err, data){
    var user = JSON.parse(data);
    res.status(200).send(user.users);
  });
});


app.get('/users/:userID', function(req,res){
    fs.readFile('database.json', function(err, data){
        var user = JSON.parse(data);
        //res.status(200).send(user.user);
        var result = "";

        for(var i = 0; i < user.users.length; i++ ){
            if(user.users[i].id == req.params.userID){                
                res.status(200).send(user.users[i]);  
            }
        }
    });
});



app.post('/users', bodyParser.json(), function(req, res){
    console.log(req.body);
    
  fs.readFile('database.json', function(err, data){
      var user = JSON.parse(data);
    
      
      user.users.push({
          "id": user.users.length,
          "vorname": JSON.stringify(req.body.vorname),
          "nachname": JSON.stringify(req.body.nachname)
      });
      
      fs.writeFile("database.json", JSON.stringify(user, null, 2));
  });
    res.status(201).send("User erfolgreich gespeichert!\n");
});



// Offer Methoden
app.get('/offers', function(req, res){
  fs.readFile('database.json', function(err, data){
    var offers = JSON.parse(data);
    res.status(200).send(offers.offers);
  });
});

app.get('/offers/:offerID', function(req,res){
    fs.readFile('database.json', function(err, data){
        var offer = JSON.parse(data);
      
        for(var i = 0; i < offer.offers.length; i++ ){
            if(offer.offers[i].id == req.params.offerID){                
                res.status(200).send(offer.offers[i]);  
            }
        }
    });
});


app.post('/offers', bodyParser.json(), function(req, res){
    fs.readFile('database.json', function(err, data){
      var offer = JSON.parse(data);
    
      
      offer.offers.push({
          "id": offer.offers.length,
          "name": JSON.stringify(req.body.name),
          "description": JSON.stringify(req.body.description)
      });
      
      fs.writeFile("database.json", JSON.stringify(offer, null, 2));
  });
    res.status(201).send("Offer erfolgreich gespeichert!\n");

});


app.listen(settings.port, function(){
  console.log("Dienstgeber läuft auf Port " + settings.port + ".");
});
