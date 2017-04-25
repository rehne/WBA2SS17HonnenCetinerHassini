var fs = require('fs');

fs.readFile('staedte.json', function(err, data){
  console.log(data.toString());
});
