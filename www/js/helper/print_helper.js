var PrintHelper = function(){};

PrintHelper.prototype.set_map = function(map, map_id){
	this.map = map;
	this.map_id = map_id;
}

PrintHelper.prototype.set_content = function(content){
	this.content = content
}

PrintHelper.prototype.print = function(){
	this.map.once('postcompose', function(event) {
		var canvas = event.context.canvas;

		this.content.find('#' + this.map_id).attr('src', canvas.toDataURL('image/png'));

		this.content.append($('<p/>', {text: "Mit freundlicher Unterstützung der Streuobstwiesen-APP"}));

		this.print_in_new_tab();
	}.bind(this));

	this.map.renderSync();
}


PrintHelper.prototype.print_in_new_tab = function(){
	var print_window = window.open();
		print_window.document.open();
		print_window.document.write(this.content.html());
		print_window.document.close();
		print_window.print();
		print_window.close();
}

