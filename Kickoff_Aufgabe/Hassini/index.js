var fs = require('fs');
var chalk = require('chalk');

fs.readFile( __dirname + '/staedte.json', function(err, data) { 
    
    if (err) {
        throw err;
    }
    else{
        data = JSON.parse(data)
        for(i = 0; data.cities[i]; i++){
        console.log(chalk.green("name: " + data.cities[i].name));
        console.log(chalk.red("country: " + data.cities[i].country));
        console.log(chalk.blue("population: " + data.cities[i].population));
        console.log("--------------------");
        }
    }

});