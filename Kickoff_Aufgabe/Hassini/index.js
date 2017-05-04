var fs = require('fs');
var chalk = require('chalk');

fs.readFile( __dirname + '/staedte.json', function(err, data) { 
    
    if (err) {
        throw err;
    }
    else{
                                          
        data = JSON.parse(data)
        data.cities.sort(function (a, b) {
        return a.population - b.population;
});
        fs.writeFile(__dirname+"/staedte_sorted.json", JSON.stringify(data));
                                                                 
                               
        for(i = 0; data.cities[i]; i++){
        console.log(chalk.green("name: " + data.cities[i].name));
        console.log(chalk.red("country: " + data.cities[i].country));
        console.log(chalk.blue("population: " + data.cities[i].population));
        console.log("--------------------");
        }
    }

});