var fs = require ('fs');


fs.readFile(__dirname+'/staedte.json',
 function(err, data) {
	 
	 
	 
	if (err){
		throw err;
	}  else {
		data = JSON.parse(data);
		
		
		for(i=0; data.cities[i];i++){
		console.log("name: " + data.cities[i].name);
		console.log("country: " + data.cities[i].country);
		console.log("population: " + data.cities[i].population);
		console.log("------------------------------");
		}
	}
	
 });
 
 

