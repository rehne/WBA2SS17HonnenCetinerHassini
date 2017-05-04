var fs = require ('fs');
var chalk = require('chalk');

fs.readFile(__dirname+'/staedte.json',
 function(err, data) {
	 
	 
	 
	if (err){
		throw err;
	}  else {
		data = JSON.parse(data);
		
		data.cities.sort(function(a,b){
			return a.population - b.population;
		});
		
		fs.writeFile("staedte_sortiert.json", JSON.stringify(data));
		
	
		for(i=0; data.cities[i];i++){
		console.log("name: " + chalk.blue(data.cities[i].name));
		console.log("country: " + chalk.red(data.cities[i].country));
		console.log("population: " + chalk.green(data.cities[i].population));
		console.log("------------------------------");
		}
	}
	
	
	
 });
 
  

