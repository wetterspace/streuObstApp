var Scanner = function(){
	this.wiese = null;
};

Scanner.prototype.is_avaible_on_device = function() {
	return (typeof cordova !== "undefined");
};

Scanner.prototype.set_wiese = function(wiese) {
	this.wiese = wiese;
};

Scanner.prototype.check_if_valid_tree_key = function(key){
	if(this.wiese.data.trees){
		var tree = this.wiese.data.trees[key];

		if(tree){
			var tree_obj = new Tree()
				tree_obj.from_server_obj(this.wiese.data.trees, key);
				tree_obj.wiese = this.wiese;

			new TreeForm(tree_obj).show_form();
		}
	}else{
		alert("Code ist für diese Wiese ungültig");
	}
}

Scanner.prototype.scan = function(){
	cordova.plugins.barcodeScanner.scan(
				function (result) {
					this.check_if_valid_tree_key(result.text);
			      }.bind(this),
			      function (error) {
			          alert("Scanning failed: " + error);
			      }
			   );
}