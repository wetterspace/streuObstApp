//tree attributes
//key und id sind immer gleich
var TreeAttr = {
pflegezustaende: {
		//wird mit pflege_from angelegt
	},

id: 	{		id: "id",
title: "ID"
	},

name: { id: "name",
		title: "Name"
	},

obstart: 	{	id: "obstart",
title: "Obstart"
	},

sortname: 	{	id: "sortname",
title:"Sorte"},

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

	images: {
		id: "images"
	},
	extra: {
		//wenn ein extra angelegt wird
	},
	icon: {
		//icon wenn ein extra angelegt wird
	}
}


var Tree = function(){

}

Tree.prototype.is_extra = function(){
	//um zu checken ob es nen extra is
	return typeof (this.extra) != 'undefined' && this.extra == true;
}

Tree.prototype.from_server_obj = function(trees, key){
	//im qr_code helper wird mithilfe des keys der baum identifiziert
	this.key = key;

	Object.keys(trees[key]).forEach(function(attr){
		this[attr] =  trees[key][attr];
	}.bind(this));
}

Tree.prototype.to_server_obj = function(){
	var server_obj = {}

	Object.keys(TreeAttr).forEach(function(attr){
		var attribute = this[attr];
 		if(typeof attribute === 'undefined'){
			attribute = null;
		};
		server_obj[attr] = attribute;
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
		this.wieseName = this.wiese.name;
		this.wiese = null;


		saveOffline(this.id, this);
		new Wiese(this.wieseName, localStorage.getItem("Arten")).show();


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

	}
};

Tree.prototype.remove = function(){
	//basically repition of save function // offline modus missing
	//simply set null
	this.wiese.getDB().child("trees").child(this.id).set(null, function(err){
		if(err){
			alert("Fehler" + err);
		}else{
			this.wiese.show();
		}
	}.bind(this));
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
