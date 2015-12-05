//tree attributes
//key und id sind immer gleich
var TreeAttr = {
	pflegezustaende: {
		//wird mit pflege_from angelegt
	},

	obstart: 	{	id: "obstart",
					title: "ObstArt"
				},

	sortname: 	{	id: "sortname",
					title:"Sortenname"},

	lon: {	id: "lon",
			title: "Longitude",
			validation: function(lon){
				if(isNaN(parseFloat(lon))){
					return false;
				}else{
					return true;
				}
			}
		},

	lat: {	id: "lat",
			title: "Latitude",
			validation: function(lat){
				if(isNaN(parseFloat(lat))){
					return false;
				}else{
					return true;
				}
			}
		},

	ploid: {	id: "ploid",
				title: "Diploid/Triploid"},

	gepflanzt_date: {	id: "gepflanzt_date",
						title: "Gepflanzt"},

	anmerkungen: {	id: "anmerkungen",
					title: "Anmerkungen"},

	bluete_beginn: {	id: "bluete_beginn",
						title: "Blüte Ende"},

	bluete_end: {	id: "bluete_end",
					title: "Blüte Ende"},

	blueintensitaet: {	id: "blueintensitaet",
						title: "Blühintensität"},

	ertragsintensitaet: {	id: "ertragsintensitaet",
							title: "Ertragsintensität"},

	temperatur_beginn: {	id: "temperatur_beginn",
							title: "Temperatur bei Beginn"},
	temperatur_ende: {		id: "temperatur_ende",
							title: "Temperatur bei Ende"}
}


var Tree = function(){

}

Tree.prototype.from_server_obj = function(trees, key){
	this.key = key; 

	Object.keys(trees[key]).forEach(function(attr){
		this[attr] =  trees[key][attr];
	}.bind(this));
}

Tree.prototype.to_server_obj = function(){
	var server_obj = {}

	Object.keys(TreeAttr).forEach(function(attr){
		server_obj[attr] = this[attr];
	}.bind(this));

	return server_obj;
}

Tree.prototype.overwrite_attributes = function(new_attributes_obj){
	Object.keys(new_attributes_obj).forEach(function(key){
		this[key] = new_attributes_obj[key];
	}.bind(this));
}

Tree.prototype.save = function() {
	//Object already exists and was saved to DB then it has a unique firebase key
	if(this.key){
        //overwetie existing object
		this.wiese.getDB().child("trees").child(this.key).set(this.to_server_obj(), function(err){
	  		if(err){
	  			alert("Fehler" + err);
	  		}else{
				this.wiese.show();
	  		}
	  	}.bind(this));

	}else{
		//has no key has to be saved
		//gets pushed to treess array
		this.wiese.getDB().child("trees").push(this.to_server_obj(), function(err){
	  		if(err){
	  			alert("Fehler" + err);
	  		}else{
				this.wiese.show();
	  		}
	  	}.bind(this));
	}
};