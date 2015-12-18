//tree attributes
//key und id sind immer gleich
var TreeAttr = {
pflegezustaende: {
		//wird mit pflege_from angelegt
	},

id: 	{		id: "id",
title: "ID"
	},
	
	
obstart: 	{	id: "obstart",
title: "ObstArt"
	},

sortname: 	{	id: "sortname",
title:"Sortenname"},
	
wieseName: 	{	id: "wiesenName",
title:"wieseName"},
	
timestamp: 	{	id: "timestamp",
title:"timestamp"},

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
	//this.key = key; 

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
	var idNew;
	if(this.id) {idNew = this.id;}
	else { idNew = ID().toString()}
	this.id = idNew;
	this.timestamp = Date.now();
	if(sessionStorage.getItem('user') == 'Offline') {
		console.log(this);
		this.wieseName = this.wiese.name;
		this.wiese = null;


		saveOffline(this.id, this);
		new Wiese(this.wieseName).show();


	}else {
		this.wieseName = this.wiese.name;

		//overwetie existing object
		this.wiese.getDB().child("trees").child(this.id).set(this.to_server_obj(), function(err){
			if(err){
				alert("Fehler" + err);
			}else{
				
				this.wiese.show();
			}
		}.bind(this));
		
		this.wiese.getDB().child("trees").child(this.id).once("value", function(snapshot){
			console.log(snapshot.val());
		});

	}
};

function treeOnOrchard(arr, lon, lat) {
	var coordArray=new Array();
	var length = arr[0].length;
	var i = 0;
	while(i<length-1) {
		var coordsLocal = 	meters2degress(parseFloat(arr[0][i][0]), parseFloat(arr[0][i][1]));
		console.log(coordsLocal);
		coordArray[i] = coordsLocal;
		i = i +1;
		
	}
	return inside([parseFloat(lon), parseFloat(lat)], coordArray); 

}


//https://gist.github.com/onderaltintas/6649521
var meters2degress = function(x,y) {
	var lon = x *  180 / 20037508.34 ;
	var lat = Math.atan(Math.exp(y * Math.PI / 20037508.34)) * 360 / Math.PI - 90;

	return [lon, lat]
}



function inside(point, vs) {
	// ray-casting algorithm based on
	// http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

	var x = point[0], y = point[1];

	var inside = false;
	for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
		var xi = vs[i][0], yi = vs[i][1];
		var xj = vs[j][0], yj = vs[j][1];

		var intersect = ((yi > y) != (yj > y))
		&& (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
		if (intersect) inside = !inside;
	}

	return inside;
};