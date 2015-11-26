var fs = require('fs');
var array = fs.readFileSync('sorten.txt').toString().split("\n");
for(i in array) {
	name = array[i].split("(")[0];
	lateinischer = array[i].split("(")[1];

	name = name.trim();	

	if(lateinischer){
	lateinischer = lateinischer.replace(")", "");
	lateinischer = lateinischer.trim();	
	}


	


	string = "{" + "\n" +
 
		'	Name: "' + name  + '", ' + "\n" 


	if(lateinischer){
		string +='	Latein: "' + lateinischer + '"' + "\n" 
	}
	
	string += "},"


    
    console.log(string)
}