var fs = require('fs');

fs.readFile('staedte.json', function(err, data){
  var staedte = JSON.parse(data);

  // Aufgabe 1: Formatierte Ausgabe auf der Konsole
  for(var i = 0; i < staedte.cities.length; i++){
    console.log('name: ' + staedte.cities[i].name);
    console.log('country: ' + staedte.cities[i].country);
    console.log('population: ' + staedte.cities[i].population);
    console.log('--------------------');
  };
});
