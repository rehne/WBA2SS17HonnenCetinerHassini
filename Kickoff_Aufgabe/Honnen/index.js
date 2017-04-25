var fs = require('fs');
var chalk = require('chalk');

fs.readFile('staedte.json', function(err, data){
  var staedte = JSON.parse(data);

  /*
   * Aufgabe 1: Formatierte Ausgabe auf der Konsole
   * &&
   * Aufgabe 2: bunte Ausgabe mit chalk.color()
   */
  for(var i = 0; i < staedte.cities.length; i++){
    console.log(chalk.cyan('name: ' + staedte.cities[i].name));
    console.log(chalk.green('country: ' + staedte.cities[i].country));
    console.log(chalk.yellow('population: ' + staedte.cities[i].population));
    if(i < staedte.cities.length - 1){
      console.log(chalk.red("--------------------"));
    }
  }
});
