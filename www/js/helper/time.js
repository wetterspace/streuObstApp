var GermanTime = function(timestamp){
	this.dateCreated = new Date(timestamp);
	monthname= new Array("Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember");
	this.dateCreated = this.dateCreated.getDate() + " " + monthname[this.dateCreated.getMonth()] + " " + this.dateCreated.getFullYear() + "; " + this.dateCreated.getHours() + ":" + this.dateCreated.getMinutes() + "Uhr";
};

GermanTime.prototype.getDate = function() {
	return this.dateCreated;
};

