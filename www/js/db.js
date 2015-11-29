var DB = function(){
	this.database = new Firebase("https://incandescent-torch-1365.firebaseio.com");

};


DB.prototype.getWiesenDB = function() {
	return this.database.child("wiesen");
};

DB.prototype.getUserDB = function() {
	return this.database.child("user");
};

