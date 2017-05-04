var fs = require ('fs');
var chalk = require('chalk');

fs.readFile(__dirname+'/staedte.json',
 function(err, data) {
	 
	 
	 
	if (err){
		throw err;
	}  else {
		data = JSON.parse(data);
	
		for(i=0; data.cities[i];i++){
		console.log("name: " + chalk.blue(data.cities[i].name));
		console.log("country: " + chalk.red(data.cities[i].country));
		console.log("population: " + chalk.green(data.cities[i].population));
		console.log("------------------------------");
		}
	}
	
 });
 
 

